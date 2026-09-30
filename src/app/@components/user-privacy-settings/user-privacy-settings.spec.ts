import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPrivacySettings } from './user-privacy-settings';

describe('UserPrivacySettings', () => {
  let component: UserPrivacySettings;
  let fixture: ComponentFixture<UserPrivacySettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPrivacySettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPrivacySettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
