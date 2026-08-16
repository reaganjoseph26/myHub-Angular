import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms'; //

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  //old way constructor(private fb: FormBuilder) {}. New way is Inject
  private fb = inject(FormBuilder);
  loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['',  Validators.required],
  });

  ngOnInit() {
    console.log('login is working');
  }

  submitLoginForm() {
    console.log(this.loginForm.value)
    console.log('submitting')
  }
}
