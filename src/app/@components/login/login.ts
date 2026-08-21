import { Component, inject, NgZone } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms'; //
import { ThemeService } from '../../services/ThemeService';
import { error } from 'three';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, map, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LoggedInUser } from '../../services/interfaces/user';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, MatIconModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  //old way constructor(private fb: FormBuilder) {}. New way is Inject
  private fb = inject(FormBuilder);
  private authservice = inject(AuthService);
  private router = inject(Router);
  private zone = inject(NgZone);

  isSubmitting: Boolean = false;
  errMsg: string = '';
  isChecked: Boolean = false;
  showPwd: Boolean = false;
  loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  // constructor() {
  //   // 1. This runs FIRST
  //   if (this.authservice.isLoggedIn()) {
  //     this.router.navigate(['/home']);
  //   }
  // }

  submitLoginForm() {
    this.isChecked = true;
    const loginObj = this.loginForm.getRawValue();

    this.authservice
      .login(loginObj)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (res) => {
          this.router.navigate(['home']);
        },
        error: (err) => {
          console.log('An error has occurred logging you in. Error: ', err);

          this.errMsg = 'Invalid username or password';
        },
      });
  }
}
