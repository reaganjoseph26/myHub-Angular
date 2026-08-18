import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp implements OnInit {
  private fb = inject(FormBuilder);
  private authservice = inject(AuthService);

  isSubmitting: Boolean = false;
  errMsg: string = '';
  isChecked: Boolean = false;
  signupForm = this.fb.nonNullable.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

  ngOnInit(): void {
    console.log('sign up working');
  }

  submitSignupForm() {
    this.isChecked = true;
    const signupObj = this.signupForm.getRawValue();
    console.log(signupObj, ' signupObj');
    console.log(this.isChecked);

    return;
    this.authservice
      .signup(signupObj)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (res) => {
          console.log('Response after signing up in: ', res);
        },
        error: (err) => {
          console.log(
            'An error has occurred attempting to create your profile. Error: ',
            err,
          );
          if (
            err.status === 400 ||
            err.error?.message === 'User does not exist'
          ) {
            this.errMsg = 'Invalid username or password';
          } else {
            this.errMsg = 'An unexpected error has occurred. Please try again.';
          }
        },
      });
  }
}
