import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-user-preferences-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './user-preferences-settings.html',
  styleUrl: './user-preferences-settings.css',
})
export class UserPreferencesSettings implements OnInit {
  preferencesData: any;
  isSubmitting: Boolean = false;
  errMsg: string = '';

  private fb = inject(NonNullableFormBuilder);
  preferencesForm = this.fb.group({
    show_location: [true],
    show_likes: [true],
    allow_search: [false],
    show_achievements: [true],
    show_socials: [true],
    show_followers: [true],
    allow_nominations: [true],
    allow_like_followers_alerts: [true],
    allow_post_replies_alerts: [true],
    allow_weekly_changes_alerts: [true],
  });

    ngOnInit() {
    if (this.preferencesData) {
      console.log(this.preferencesData, 'this.preferencesForm in ngOnInit');
      this.preferencesForm.patchValue(this.preferencesData);
    }
  }

    getDirtyValues(form: FormGroup): any {
    const dirtyValues: any = {};

    Object.keys(form.controls).forEach((key) => {
      const currentControl = form.controls[key];

      if (currentControl instanceof FormGroup) {
        // Recursively extract changes from nested FormGroups
        const nestedDirtyValues = this.getDirtyValues(currentControl);
        if (Object.keys(nestedDirtyValues).length > 0) {
          dirtyValues[key] = nestedDirtyValues;
        }
      } else if (currentControl.dirty) {
        // Capture value only if the control was modified
        dirtyValues[key] = currentControl.value;
      }
    });

    return dirtyValues;
  }

  submitPreferencesForm() {
    const changedData = this.getDirtyValues(this.preferencesForm);

    console.log('Payload:', changedData);

    console.log(
      this.preferencesForm.value
    );
  }
}
