import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark'
        }
      },
      license: 'eyJpZCI6IjRlMDM0MzI3LWEyZmEtNDZkZC05ODIwLTE0NDVhMTE5NGJlMiIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODcxOTU0OTQsImV4cCI6MTgxODczMTQ5NH0.LI89onesLzFDACflQ3M1DXa79mszxebspp-pPuPhQspSXyH0SeKatPdakybhJlUELQmhT84DwPG2d1GkYaKvCg'
    }),
  ],
};
