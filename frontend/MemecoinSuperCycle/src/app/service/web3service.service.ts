import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Eip1193Provider, BrowserProvider, ethers } from 'ethers';

declare global {
  interface Window {
    ethereum: Eip1193Provider;
  }
}

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  private provider: BrowserProvider;
  private accountSubject = new BehaviorSubject<string>('');
  public account$ = this.accountSubject.asObservable();

  constructor() {
    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.checkWalletConnection();
  }

  async checkWalletConnection() {
    if (typeof window.ethereum !== 'undefined') {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await this.provider.listAccounts();
      if (accounts.length > 0) {
        this.accountSubject.next(accounts[0].address);
      }
    }
  }

  async connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await this.provider.send('eth_requestAccounts', []);
        this.accountSubject.next(accounts[0]);
        return accounts[0];
      } catch (error) {
        console.error('User rejected connection:', error);
        throw error;
      }
    } else {
      window.open('https://metamask.io/download/', '_blank');
      throw new Error('Please install MetaMask');
    }
  }

  async disconnectWallet() {
    this.accountSubject.next('');
  }

  isConnected(): boolean {
    return !!this.accountSubject.value;
  }
}
