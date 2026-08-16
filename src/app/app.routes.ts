import { Routes } from '@angular/router';
import { Home } from './@components/home/home';
import { Profile } from './@components/profile/profile';
import { Navigation } from './@components/navigation/navigation';
import { Login } from './@components/login/login';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: 'home',
    component: Home,
    // children: [
    //   {
    //     path: 'profile/:username',
    //     component: Profile,
    //   },
    // ],
  },
  { path: 'profile/:username', component: Profile },
];
