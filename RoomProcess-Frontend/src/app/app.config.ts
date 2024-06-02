import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { customInterceptor } from '../services/custom.interceptor'; //dodat interceptor za tokenizaciju

export const appConfig: 
ApplicationConfig = { 
providers:[provideRouter(routes),provideHttpClient(withFetch()), provideHttpClient(withInterceptors([customInterceptor]))] 
};

/*export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration()]
};*/

/*export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), **provideHttpClient()**]
};*/
