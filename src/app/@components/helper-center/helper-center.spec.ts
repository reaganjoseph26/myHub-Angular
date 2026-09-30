import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelperCenter } from './helper-center';

describe('HelperCenter', () => {
  let component: HelperCenter;
  let fixture: ComponentFixture<HelperCenter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelperCenter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelperCenter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
