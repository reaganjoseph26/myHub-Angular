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
  imports: [ReactiveFormsModule],
  templateUrl: './user-profile-settings.html',
  styleUrl: './user-profile-settings.css',
})
export class UserProfileSettings implements OnInit {
   isSubmitting: Boolean = false;
  errMsg: string = '';
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
        validators: [
          Validators.required,
          Validators.maxLength(140),
          Validators.minLength(1),
        ],
      }),
      city: new FormControl('', {
        validators: [
          Validators.required,
          Validators.maxLength(60),
          Validators.minLength(1),
        ],
      }),
      state: new FormControl('', {
        validators: [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(1),
        ],
      }),
      zip_code: new FormControl('', {
        validators: [
          Validators.required,
          Validators.maxLength(20),
          Validators.minLength(1),
        ],
      }),
    }),
  });

  ngOnInit() {
    console.log('hey hey hey user profile settings component');
  }

  submitProfileForm() {
    console.log('hehe');
  }
}
