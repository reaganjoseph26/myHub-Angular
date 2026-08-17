import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from './services/UsersService';
import { ThemeService } from './services/ThemeService';

// export function initializeApp(userService: UserService) {
//   return () => userService.getServerData('getActiveUsers');
// }

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAppInitializer(() => {
      const themeService = inject(ThemeService);
      return themeService.getDefaultTheme();
    }),

    // provideAppInitializer(() => {
    //   const userService = inject(UserService);
    //   return UserService.getServerData('getActiveUsers');
    // }),
  ],
};
