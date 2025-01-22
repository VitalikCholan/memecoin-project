import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Eip1193Provider, BrowserProvider, ethers } from 'ethers';
import { NETWORKS } from '../config/networks';

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

  async switchNetwork(networkName: string) {
    const network = NETWORKS[networkName];
    if (!network) throw new Error('Network not configured');

    try {
      // Try to switch to the network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.chainId }],
      });
    } catch (error: any) {
      // If the network isn't added to MetaMask, add it
      if (error.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [network],
        });
      } else {
        throw error;
      }
    }
  }
}
