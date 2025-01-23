import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3Service } from '../../../service/web3service.service';

@Component({
  selector: 'app-network-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './network-button.component.html',
  styleUrl: './network-button.component.css',
})
export class NetworkButtonComponent {
  constructor(private web3Service: Web3Service) {}

  async switchNetwork(event: Event) {
    const network = (event.target as HTMLSelectElement).value;
    if (!network) return;

    try {
      await this.web3Service.switchNetwork(network);
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  }
}
