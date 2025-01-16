import { Injectable } from '@angular/core';
import { ethers, Contract } from 'ethers';
import FaucetABI from '../abi/FaucetMSC.json';
import { Web3Service } from './web3service.service';

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

  async requestTokens() {
    if (!this.faucetContract) await this.initContract();
    try {
      const tx = await this.faucetContract?.['requestTokens']();
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error requesting tokens:', error);
      throw error;
    }
  }
}
