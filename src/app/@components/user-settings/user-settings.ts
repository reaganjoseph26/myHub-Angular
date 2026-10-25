import {
  Component,
  effect,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
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
  RouterLinkActive,
} from '@angular/router';
import { UserProfileSettings } from '../user-profile-settings/user-profile-settings';
import { UserPreferencesSettings } from '../user-preferences-settings/user-preferences-settings';

@Component({
  selector: 'app-user-settings',
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './user-settings.html',
  styleUrl: './user-settings.css',
})
export class UserSettings {
  data = inject(ActivatedRoute).snapshot.data;
  profileForm = signal({
    personalInfo: {
      firstname: this.data['userData'].firstname.trim() || '',
      lastname: this.data['userData'].lastname.trim() || '',
      username: this.data['userData'].username.trim() || '',
      email: this.data['userData'].email.trim() || '',
      gender: this.data['userData'].gender.trim() || '',
      race_ethnicity: this.data['userData'].race_ethnicity.trim() || '',
    },
    locationInfo: {
      country: this.data['userData'].country || '',
      city: this.data['userData'].city || '',
      state: this.data['userData'].state || '',
      zip_code: this.data['userData'].zip_code || '',
    },
  });

  preferencesForm = signal({
    show_location: this.data['userData'].user_setting.show_location || false,
    // show_likes: this.data['userData'].user_setting.show_likes || false,
    allow_search: this.data['userData'].user_setting.allow_search || false,
    show_achievements:
      this.data['userData'].user_setting.show_achievements || false,
    show_socials: this.data['userData'].user_setting.show_socials || false,
    show_followers: this.data['userData'].user_setting.show_followers || false,
    allow_nominations:
      this.data['userData'].user_setting.allow_nominations || false,
    allow_like_followers_alerts:
      this.data['userData'].user_setting.allow_like_followers_alerts || false,
    allow_post_replies_alerts:
      this.data['userData'].user_setting.allow_post_replies_alerts || false,
    allow_weekly_changes_alerts:
      this.data['userData'].user_setting.allow_weekly_changes_alerts || false,
  });

  onRouteActivated(componentRef: any) {
    // Check if the activated component is the Profile Child
    if (componentRef instanceof UserProfileSettings) {
      // Direct assignment or passing a signal reference
      componentRef.profileData = this.profileForm();
    }

    if (componentRef instanceof UserPreferencesSettings) {
      componentRef.preferencesData = this.preferencesForm();
    }
  }
}
