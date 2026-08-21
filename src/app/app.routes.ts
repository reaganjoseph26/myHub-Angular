import { ResolveFn, Routes } from '@angular/router';
import { Home } from './@components/home/home';
import { Profile } from './@components/profile/profile';
import { Login } from './@components/login/login';
import { ThemeService } from './services/ThemeService';
import { inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserService } from './services/UsersService';
import { SignUp } from './@components/sign-up/sign-up';
import { authGuard, isLoggedInGuard } from './guards/auth-guard';

export const themeResolver: ResolveFn<Observable<any>> = (route) => {
  const themeService = inject(ThemeService);
  return themeService
    .getDefaultTheme()
    .pipe(
      tap((data) => console.log('Resolved themeResolver HTTP data:', data)),
    );
};

export const homeDataResolver: ResolveFn<Observable<any>> = (route) => {
  const userService = inject(UserService);
  return userService.getUserData();
};

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login, canActivate:[isLoggedInGuard] },
  { path: 'sign-up', component: SignUp },
  {
    path: 'home',
    component: Home,
    resolve: { userData: homeDataResolver },
    canActivate: [authGuard],
    // children: [
    //   {
    //     path: 'profile/:username',
    //     component: Profile,
    //   },
    // ],
  },
  { path: 'profile/:username', component: Profile, canActivate: [authGuard] },
  { path: 'hub/:username', component: Profile },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
