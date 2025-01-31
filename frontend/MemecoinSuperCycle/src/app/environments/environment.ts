import { config } from '../config/config';

export const environment = {
  production: false,
  infuraSepolia: `${config.infura.sepolia.endpoint}${config.infura.sepolia.key}`,
  infuraBaseSepolia: `${config.infura.baseSepolia.endpoint}${config.infura.baseSepolia.key}`,
};
