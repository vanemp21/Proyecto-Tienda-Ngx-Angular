import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
const nuevo = new BehaviorSubject<boolean>(false);
  const authService = inject(AuthService);
  const isLogged = authService.userLogged()
  const router = inject(Router);
//si no esta logeado permite la entrada
  if (!isLogged) {
    return true;
  } else {
    //si está logeado no permite la entrada 
    router.navigate(['/']);
    return false;
  }
};
