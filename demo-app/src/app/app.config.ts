import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';

const AppTheme = definePreset(Aura, {
  components: {
    button: {
      root: {
        borderRadius: '4px',
      },
      colorScheme: {
        light: {
          root: {
            primary: {
              background: 'rgb(78, 157, 168)',
              hoverBackground: 'rgb(60, 138, 149)',
              activeBackground: 'rgb(50, 120, 130)',
              borderColor: 'rgb(78, 157, 168)',
              hoverBorderColor: 'rgb(60, 138, 149)',
              activeBorderColor: 'rgb(50, 120, 130)',
              color: '#ffffff',
              hoverColor: '#ffffff',
              activeColor: '#ffffff',
            },
          },
        },
      },
    },
    progressspinner: {
      colorScheme: {
        light: {
          root: {
            colorOne: 'rgb(78, 157, 168)',
            colorTwo: 'rgb(78, 157, 168)',
            colorThree: 'rgb(78, 157, 168)',
            colorFour: 'rgb(78, 157, 168)',
          },
        },
      },
    },
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
