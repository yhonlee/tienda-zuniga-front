import { inject } from '@angular/core';
import { Router, CanMatchFn } from '@angular/router';
import { TokenService } from 'src/app/shared/services/token.service';

export const redirectIfAuthenticatedGuardFn: CanMatchFn = () => {

    const tokenService: TokenService = inject(TokenService);
    const router: Router = inject(Router);

    if (tokenService.isAuthenticated) {
        router.navigate(['/ventas']);
        return false;
    }

    return true;
}
