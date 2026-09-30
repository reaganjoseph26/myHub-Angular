import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCusotmizationSettings } from './user-customization-settings';

describe('UserCusotmizationSettings', () => {
  let component: UserCusotmizationSettings;
  let fixture: ComponentFixture<UserCusotmizationSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCusotmizationSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCusotmizationSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
