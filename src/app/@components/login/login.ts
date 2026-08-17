import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms'; //
import { ThemeService } from '../../services/ThemeService';
import { error } from 'three';
import { ActivatedRoute } from '@angular/router';
import { finalize, map, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LoggedInUser } from '../../services/interfaces/user';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  //old way constructor(private fb: FormBuilder) {}. New way is Inject
  private fb = inject(FormBuilder);
  private authservice = inject(AuthService);

  isSubmitting: Boolean = false;
  errMsg: string = '';
  isChecked: Boolean = false;
  loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  ngOnInit() {
    console.log('login is working');
  }

  // changeColor() {
  //   this.theme.setColors('orange', 'pink', 'pink'); // Updates across the app
  // }

  submitLoginForm() {
    this.isChecked = true;
    const loginObj = this.loginForm.getRawValue();
    console.log(loginObj, ' loginObj');
    console.log(this.isChecked);

    this.authservice
      .login(loginObj)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (res) => {
          console.log('Response after logging in: ', res);
        },
        error: (err) => {
          console.log('An error has occurred logging you in. Error: ', err);
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
