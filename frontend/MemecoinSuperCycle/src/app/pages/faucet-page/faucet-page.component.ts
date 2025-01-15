import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3Service } from '../../service/web3service.service';

@Component({
  selector: 'app-faucet-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faucet-page.component.html',
  styleUrl: './faucet-page.component.css',
})
export class FaucetPageComponent implements OnInit {
  public account: string = '';
  public isConnecting: boolean = false;

  constructor(private web3Service: Web3Service) {}

  ngOnInit() {
    this.web3Service.account$.subscribe((account) => (this.account = account));
  }

  async connectWallet() {
    try {
      this.isConnecting = true;
      await this.web3Service.connectWallet();
    } catch (error) {
      console.error('Connection failed:', error);
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
}
