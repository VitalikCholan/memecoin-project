import { environment } from '../environments/environment';

interface NetworkConfig {
  chainId: string;
  chainName: string;
  rpcUrls: [string | undefined];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls: string[];
}

export const NETWORKS: { [key: string]: NetworkConfig } = {
  sepolia: {
    chainId: '0xaa36a7',
    chainName: 'Sepolia',
    rpcUrls: [environment.infuraSepolia],
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
  },
  baseSepolia: {
    chainId: '0x14a34',
    chainName: 'Base Sepolia',
    rpcUrls: [environment.infuraBaseSepolia],
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://sepolia.basescan.org'],
  },
};
