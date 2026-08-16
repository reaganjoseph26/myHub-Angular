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
  isChecked:Boolean = false;
  //old way constructor(private fb: FormBuilder) {}. New way is Inject
  private fb = inject(FormBuilder);
  loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
   
  });

  ngOnInit() {
    console.log('login is working');
  }

  submitLoginForm() {
    const loginObj = this.loginForm.value;

    console.log(loginObj);
    console.log(this.isChecked);
    console.log('submitting');
  }
}
