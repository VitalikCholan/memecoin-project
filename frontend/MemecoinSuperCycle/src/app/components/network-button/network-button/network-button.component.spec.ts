import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkButtonComponent } from './network-button.component';

describe('NetworkButtonComponent', () => {
  let component: NetworkButtonComponent;
  let fixture: ComponentFixture<NetworkButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
