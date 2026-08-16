import { Routes } from '@angular/router';
import { Home } from './@components/home/home';
import { Profile } from './@components/profile/profile';
import { Navigation } from './@components/navigation/navigation';
export const routes: Routes = [
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
