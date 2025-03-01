import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3Service } from '../../service/web3service.service';
import { ContractService } from '../../service/contract.service';
import { NetworkButtonComponent } from '../../components/network-button/network-button/network-button.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-faucet-page',
  standalone: true,
  imports: [CommonModule, NetworkButtonComponent],
  templateUrl: './faucet-page.component.html',
  styleUrl: './faucet-page.component.css',
})
export class FaucetPageComponent implements OnInit, OnDestroy {
  public account: string = '';
  public isConnecting: boolean = false;
  public message: string = '';
  public isMetaMaskInstalled: boolean = false;
  private accountSubscription?: Subscription;

  constructor(
    private web3Service: Web3Service,
    private contractService: ContractService
  ) {
    this.isMetaMaskInstalled = typeof window.ethereum !== 'undefined';
  }

  async ngOnInit() {
    if (this.isMetaMaskInstalled) {
      this.accountSubscription = this.web3Service.account$.subscribe(
        (account) => (this.account = account)
      );
    } else {
      this.message = 'Please install MetaMask to use this feature';
    }
  }

  openMetaMaskDownload() {
    window.open(
      'https://metamask.io/download/',
      '_blank',
      'noopener,noreferrer'
    );
  }

  async connectWallet() {
    try {
      this.isConnecting = true;
      if (!this.isMetaMaskInstalled) {
        this.openMetaMaskDownload();
        this.message = 'Please install MetaMask to continue';
        return;
      }
      await this.web3Service.connectWallet();
    } catch (error) {
      console.error('Connection failed:', error);
      this.message = 'Failed to connect wallet';
    } finally {
      this.isConnecting = false;
    }
  }

  disconnectWallet() {
    this.web3Service.disconnectWallet();
  }

  shortenAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  async requestTokens() {
    try {
      // If wallet is not connected, connect it first
      if (!this.account) {
        await this.connectWallet();
        if (!this.account) {
          this.message = 'Please connect your wallet to request tokens';
          return;
        }
      }

      // Now proceed with token request
      const result = await this.contractService.requestTokens();
      this.message = result.message;
    } catch (error) {
      console.error('Error:', error);
      this.message = 'Failed to request tokens';
    }
  }

  ngOnDestroy() {
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
    }
  }
}
