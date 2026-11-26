import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withHashLocation } from '@angular/router'; // 👈 Agregamos withHashLocation
import { provideHttpClient, withInterceptors, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app.routes';
import { TokenInterceptor, tokenInterceptor } from '@app/interceptors/token-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes, 
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
      withHashLocation() // 👈 Soluciona el 403 en S3 al navegar o recargar
    ),
    provideHttpClient(
      withInterceptors([tokenInterceptor]), // 👈 Quitamos mockBackendInterceptor para que consulte tu EC2 real
      withInterceptorsFromDi()
    ),
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ]
};
