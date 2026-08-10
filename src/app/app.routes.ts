import { Routes } from '@angular/router';
import { Home } from '../@components/home/home';
import { Profile } from '../@components/profile/profile';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'profile/:username', component: Profile },
];
