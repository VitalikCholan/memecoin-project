import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToBuyComponent } from './how-to-buy.component';

describe('HowToBuyComponent', () => {
  let component: HowToBuyComponent;
  let fixture: ComponentFixture<HowToBuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowToBuyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HowToBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
