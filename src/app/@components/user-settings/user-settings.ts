import { Component, effect, Input, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-settings',
  imports: [],
  templateUrl: './user-settings.html',
  styleUrl: './user-settings.css',
})
export class UserSettings implements OnInit {
 ngOnInit() {
  console.log('hey hey hey user settings component');
 }
}
