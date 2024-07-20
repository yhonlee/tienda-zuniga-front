import { inject } from '@angular/core';
import { Router, CanMatchFn } from '@angular/router';
import { TokenService } from 'src/app/shared/services/token.service';



export const authGuardFn: CanMatchFn = () => {

  const tokenService: TokenService = inject(TokenService);
  const router: Router = inject(Router);

  if (tokenService.isAuthenticated) return true;

  router.navigateByUrl('/login');
  return false;
}
