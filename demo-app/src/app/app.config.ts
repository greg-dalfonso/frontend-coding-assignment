import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';

const AppTheme = definePreset(Aura, {
  components: {
    datatable: {
      headerCell: {
        hoverBackground: '{content.background}',
        hoverColor: '{content.color}',
        selectedBackground: '{content.background}',
        selectedColor: '{content.color}',
      },
      sortIcon: {
        color: '{content.color}',
      },
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    providePrimeNG({
      theme: {
        preset: AppTheme,
        options: {
          darkModeSelector: false,
        },
      },
    }),
  ],
};
