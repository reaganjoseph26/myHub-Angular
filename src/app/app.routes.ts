import { ResolveFn, Routes } from '@angular/router';
import { Home } from './@components/home/home';
import { Login } from './@components/login/login';
import { ThemeService } from './services/ThemeService';
import { inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserService } from './services/UsersService';
import { SignUp } from './@components/sign-up/sign-up';
import { authGuard, isLoggedInGuard } from './guards/auth-guard';
import { Unauthorized } from './@components/unauthorized/unauthorized';
import { UserSettings } from './@components/user-settings/user-settings';
import { UserFavorites } from './@components/user-favorites/user-favorites';
import { Hub } from './@components/hub/hub';
import { Network } from './@components/network/network';
import { Projects } from './@components/projects/projects';

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
  { path: 'login', component: Login, canActivate: [isLoggedInGuard] },
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
  {
    path: 'hub/:username',
    component: Hub,
    canActivate: [authGuard],
    resolve: { userData: homeDataResolver },
  },
  { path: 'network', component: Network, canActivate: [authGuard] },
  { path: 'projects', component: Projects, canActivate: [authGuard] },
  { path: 'favorites/:username', component: UserFavorites },
  {
    path: 'settings/:username',
    loadComponent: () =>
      import('./@components/user-settings/user-settings').then(
        (m) => m.UserSettings,
      ),
    canActivate: [authGuard],
    canActivateChild: [authGuard],
     resolve: { userData: homeDataResolver },
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./@components/user-profile-settings/user-profile-settings').then(
            (m) => m.UserProfileSettings,
          ),
      },
      {
        path: 'preferences',
        loadComponent: () =>
          import('./@components/user-preferences-settings/user-preferences-settings').then(
            (m) => m.UserPreferencesSettings,
          ),
      },
      {
        path: 'privacy',
        loadComponent: () =>
          import('./@components/user-privacy-settings/user-privacy-settings').then(
            (m) => m.UserPrivacySettings,
          ),
      },
      {
        path: 'customization',
        loadComponent: () =>
          import('./@components/user-customization-settings/user-customization-settings').then(
            (m) => m.UserCustomizationSettings,
          ),
      },
    ],
  },
  // { path: 'settings/:username', component: UserSettings, children: []
  // },
  { path: 'unauthorized', component: Unauthorized },

  {
    path: '**',
    redirectTo: 'home',
  },
];
