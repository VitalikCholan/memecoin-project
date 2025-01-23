import { Injectable } from '@angular/core';
import { ethers, Contract } from 'ethers';
import { Web3Service } from './web3service.service';
import FaucetABI from '../abi/FaucetMSC.json';
@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private faucetContract: Contract | null = null;
  private readonly FAUCET_ADDRESS = {
    sepolia: '0xe5677F16a73e894964Fc2b06fa9f2653C519a1fD',
    baseSepolia: '0x8EF8c5CD456E2D3DCaDCa90bEb51159F90AFa089',
  };

  constructor(private web3Service: Web3Service) {}

  private async initContract(chainId: bigint) {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Select address based on chainId
      const address =
        chainId === BigInt(84532)
          ? this.FAUCET_ADDRESS.baseSepolia
          : this.FAUCET_ADDRESS.sepolia;
      this.faucetContract = new ethers.Contract(address, FaucetABI.abi, signer);
    }
  }

  async requestTokens(): Promise<{ success: boolean; message: string }> {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const currentNetwork =
        chainId === '0x14a34'
          ? 'Base Sepolia'
          : chainId === '0xaa36a7'
          ? 'Sepolia'
          : 'Unknown';

      // Check if we're on a supported network
      if (chainId !== '0x14a34' && chainId !== '0xaa36a7') {
        try {
          await this.web3Service.switchNetwork('baseSepolia'); // Default to Base Sepolia
          return {
            success: false,
            message:
              'Please switch to Base Sepolia or Sepolia network and try again',
          };
        } catch (error) {
          return {
            success: false,
            message: 'Failed to switch network. Please try again.',
          };
        }
      }

      await this.initContract(BigInt(chainId));

      if (!this.faucetContract) {
        return {
          success: false,
          message: 'Failed to initialize contract',
        };
      }

      const tx = await this.faucetContract['requestTokens']();
      await tx.wait();

      return {
        success: true,
        message: `Tokens received successfully on ${currentNetwork}!`,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        if (error.message.includes('Please wait 1 minutes between requests')) {
          return {
            success: false,
            message: 'Please wait 1 minute before requesting again',
          };
        }

        if (error.message.includes('Faucet empty')) {
          return {
            success: false,
            message: 'Faucet is currently empty. Please try again later',
          };
        }

        if (error.message.includes('Transfer failed')) {
          return {
            success: false,
            message: 'Token transfer failed. Please try again',
          };
        }
      }

      return {
        success: false,
        message: 'An error occurred while requesting tokens',
      };
    }
  }
}
