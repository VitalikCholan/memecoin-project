import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaucetPageComponent } from './faucet-page.component';

describe('FaucetPageComponent', () => {
  let component: FaucetPageComponent;
  let fixture: ComponentFixture<FaucetPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaucetPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaucetPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
