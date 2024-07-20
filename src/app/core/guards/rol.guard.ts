import { inject } from '@angular/core';
import { Router, CanMatchFn } from '@angular/router';
import { TokenService } from 'src/app/shared/services/token.service';

export const rolGuardFn: CanMatchFn = () => {

  const tokenService: TokenService = inject(TokenService);
  const router: Router = inject(Router);

  if (tokenService.getUser!.id_rol == 20){
    return true;
  } 

  router.navigateByUrl('/ventas');
  return false;
}
