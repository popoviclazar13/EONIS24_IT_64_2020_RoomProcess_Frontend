import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);
  const user = authService.getUserRole();

  
  //Ovde pisem sve rute i korisnika koji kada pokusa da ode na drugu stranicu da se prebaci
  if (route.routeConfig?.path === 'korisnik' && user === 3 ||
  route.routeConfig?.path === 'uloga' && user === 3
  ) {
    router.navigate(['/home']); // Preusmeri korisnika na neku drugu stranicu, npr. 'home'
    return false;
  }
  return true;
};
