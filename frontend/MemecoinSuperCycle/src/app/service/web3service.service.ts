import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Eip1193Provider, BrowserProvider, ethers } from 'ethers';
import { NETWORKS } from '../config/networks'; // Import the networks configuration

type EthereumEventMap = {
  chainChanged: (chainId: string) => void;
  accountsChanged: (accounts: string[]) => void;
  connect: (info: { chainId: string }) => void;
  disconnect: (error: { code: number; message: string }) => void;
};

declare global {
  interface Window {
    ethereum: Eip1193Provider & {
      request: (args: {
        method: string;
        params?: unknown[];
      }) => Promise<unknown>;
      on<K extends keyof EthereumEventMap>(
        event: K,
        handler: EthereumEventMap[K]
      ): void;
      removeListener<K extends keyof EthereumEventMap>(
        event: K,
        handler: EthereumEventMap[K]
      ): void;
    };
  }
}

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  private provider: BrowserProvider;
  private accountSubject = new BehaviorSubject<string>('');
  public account$ = this.accountSubject.asObservable();
  private networkSubject = new BehaviorSubject<string>('');
  public network$ = this.networkSubject.asObservable();

  constructor() {
    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.checkWalletConnection();
    this.listenToNetworkChanges();
  }

  private listenToNetworkChanges() {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('chainChanged', (chainId: string) => {
        this.networkSubject.next(chainId);
        this.checkWalletConnection(); // Refresh connection state
      });
    }
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
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });

      const network = NETWORKS[networkName];
      if (!network) return;

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: network.chainId }],
        });
      } catch (error: unknown) {
        if (error instanceof Error && 'code' in error && error.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: network.chainId,
                chainName: network.chainName,
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: [network.rpcUrls],
                blockExplorerUrls: [network.blockExplorerUrls],
              },
            ],
          });
        }
        throw error;
      }
    } catch (error) {
      console.error('Failed to switch network:', error);
      throw error;
    }
  }
}
