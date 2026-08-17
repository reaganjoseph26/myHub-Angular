import { ResolveFn, Routes } from '@angular/router';
import { Home } from './@components/home/home';
import { Profile } from './@components/profile/profile';
import { Login } from './@components/login/login';
import { ThemeService } from './services/ThemeService';
import { inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserService } from './services/UsersService';

export const themeResolver: ResolveFn<Observable<any>> = (route) => {
  const themeService = inject(ThemeService);
  return themeService
    .getDefaultTheme()
    .pipe(tap((data) => console.log('Resolved themeResolver HTTP data:', data)));
};

export const loggedInUserResolver: ResolveFn<Observable<any>> = (route) => {
  const userService = inject(UserService);
  return userService
    .getTestData()
    .pipe(tap((data) => console.log('Resolved loggedInUserResolver HTTP data:', data)));
};

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: 'home',
    component: Home,
    resolve: { themeData: themeResolver },
    // children: [
    //   {
    //     path: 'profile/:username',
    //     component: Profile,
    //   },
    // ],
  },
  { path: 'profile/:username', component: Profile },
];
