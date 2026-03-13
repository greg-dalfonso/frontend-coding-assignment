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
        background: 'rgb(250, 250, 250)',
        hoverBackground: 'rgb(250, 250, 250)',
        selectedBackground: 'rgb(250, 250, 250)',
        hoverColor: '{content.color}',
        selectedColor: '{content.color}',
        padding: '0.5rem',
      },
      sortIcon: {
        color: '{content.color}',
      },
      colorScheme: {
        light: {
          row: {
            stripedBackground: 'rgb(253, 253, 253)',
          },
        },
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
