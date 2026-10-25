import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-user-profile-settings',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-profile-settings.html',
  styleUrl: './user-profile-settings.css',
})
export class UserProfileSettings implements OnInit {
  profileData: any;
  isSubmitting: Boolean = false;
  errMsg: string = '';
  raceEthnicityOptions: string[] = [
    'Prefer not to say',
    'White',
    'Hispanic or Latino',
    'Black or African American',
    'Native American or Alaska Native',
    'Asian',
  ];
  genderOptions: string[] = ['Prefer not to say', 'Non-binary', 'Man', 'Woman'];
  private fb = inject(FormBuilder);
  profileForm = this.fb.group({
    personalInfo: new FormGroup({
      firstname: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.maxLength(255),
          Validators.minLength(1),
        ],
      }),
      lastname: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.maxLength(255),
          Validators.minLength(1),
        ],
      }),
      username: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.maxLength(15),
          Validators.minLength(1),
        ],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.maxLength(255),
          Validators.minLength(1),
        ],
      }),
      gender: new FormControl('Prefer not to say', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.maxLength(60),
          Validators.minLength(1),
        ],
      }),
      race_ethnicity: new FormControl('Prefer not to say', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.maxLength(60),
          Validators.minLength(1),
        ],
      }),
    }),
    locationInfo: new FormGroup({
      country: new FormControl('Prefer not to say', {
        validators: [Validators.maxLength(140), Validators.minLength(1)],
      }),
      city: new FormControl('', {
        validators: [Validators.maxLength(60), Validators.minLength(1)],
      }),
      state: new FormControl('', {
        validators: [Validators.maxLength(10), Validators.minLength(1)],
      }),
      zip_code: new FormControl('', {
        validators: [Validators.maxLength(20), Validators.minLength(1)],
      }),
    }),
  });

  ngOnInit() {
    console.log('hey hey hey user profile settings component');

    console.log(this.profileForm, 'this.profileForm in ngOnInit');
    if (this.profileData) {
      console.log(this.profileData, 'this.profileData in ngOnInit');
      this.profileForm.patchValue(this.profileData);
    }
  }

  getDirtyValues(form: FormGroup): any {
    const dirtyValues: any = {};

    Object.keys(form.controls).forEach((key) => {
      const currentControl = form.controls[key];

      if (currentControl instanceof FormGroup) {
        // Recursively extract changes from nested FormGroups
        const nestedDirtyValues = this.getDirtyValues(currentControl);
        if (Object.keys(nestedDirtyValues).length > 0) {
          dirtyValues[key] = nestedDirtyValues;
        }
      } else if (currentControl.dirty) {
        // Capture value only if the control was modified
        dirtyValues[key] = currentControl.value;
      }
    });

    return dirtyValues;
  }

  submitProfileForm() {
    const changedData = this.getDirtyValues(this.profileForm);

    console.log('Payload:', changedData);

    console.log(
      this.profileForm.value,
      'this.profileForm.value in submitProfileForm',
    );
  }
}
