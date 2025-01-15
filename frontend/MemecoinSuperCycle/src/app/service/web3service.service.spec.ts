import { TestBed } from '@angular/core/testing';

import { Web3serviceService } from './web3service.service';

describe('Web3serviceService', () => {
  let service: Web3serviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Web3serviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
