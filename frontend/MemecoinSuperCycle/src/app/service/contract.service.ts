import { Injectable } from '@angular/core';
import { ethers, Contract } from 'ethers';
import { Web3Service } from './web3service.service';
import FaucetABI from '../abi/FaucetMSC.json';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private faucetContract: Contract | null = null;
  private readonly FAUCET_ADDRESS =
    '0xe5677F16a73e894964Fc2b06fa9f2653C519a1fD';

  constructor(private web3Service: Web3Service) {
    this.initContract();
  }

  private async initContract() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      this.faucetContract = new ethers.Contract(
        this.FAUCET_ADDRESS,
        FaucetABI.abi,
        signer
      );
    }
  }

  async requestTokens(): Promise<{ success: boolean; message: string }> {
    if (!this.faucetContract) await this.initContract();
    try {
      const tx = await this.faucetContract?.['requestTokens']();
      await tx.wait();
      return { success: true, message: 'Tokens received successfully!' };
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
