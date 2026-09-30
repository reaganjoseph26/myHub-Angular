import { Component, effect, inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  RouterLink,
  ActivatedRoute,
  Router,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'app-user-settings',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './user-settings.html',
  styleUrl: './user-settings.css',
})
export class UserSettings implements OnInit {
  ngOnInit() {
    console.log('hey hey hey user settings component');
  }
}
