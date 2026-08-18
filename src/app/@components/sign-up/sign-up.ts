import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

const pwdMatchValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  // If fields haven't loaded yet or values match, return no errors
  if (
    !password ||
    !confirmPassword ||
    password.value === confirmPassword.value
  ) {
    return null;
  }

  // Set the error directly on the confirmPassword field so UI bindings pick it up
  confirmPassword.setErrors({ passwordMismatch: true });
  return { passwordMismatch: true };
};

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authservice = inject(AuthService);

  isSubmitting: Boolean = false;
  errMsg: string = '';

  signupForm = this.fb.nonNullable.group(
    {
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      email: [''],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: pwdMatchValidator, // <--- Applied globally to cross-validate fields
    },
  );

  ngOnInit(): void {
    console.log('sign up working');
  }

  submitSignupForm() {
    this.isSubmitting = true;
    const { confirmPassword, ...signupObj } = this.signupForm.getRawValue();

    console.log(signupObj, ' signupObj');

    this.authservice
      .signup(signupObj)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (res) => {
          console.log('Response after signing up in: ', res);
          this.router.navigate(['home']);
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
          } else if(err.status === 409) {
            this.errMsg = err.error

          } else {
            this.errMsg = 'Your profile cannot be created at this time.';
          }
        },
      });
  }
}
