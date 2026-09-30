import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPreferencesSettings } from './user-preferences-settings';

describe('UserPreferencesSettings', () => {
  let component: UserPreferencesSettings;
  let fixture: ComponentFixture<UserPreferencesSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPreferencesSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPreferencesSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
