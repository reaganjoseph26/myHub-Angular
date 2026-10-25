import { Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-privacy-settings',
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './user-privacy-settings.html',
  styleUrl: './user-privacy-settings.css',
})
export class UserPrivacySettings implements OnInit {
  privacyData: any;
  isSubmitting: Boolean = false;
  errMsg: string = '';

  private fb = inject(NonNullableFormBuilder);
  privacyForm = this.fb.group({
    oldPwd: '',
    newPwd: '',
    verifyPwd: '',
  });

  ngOnInit() {
    if (this.privacyData) {
      this.privacyForm.patchValue(this.privacyData);
    }
  }

  submitPrivacyForm() {
    console.log('privacy form submitting');
  }
}
