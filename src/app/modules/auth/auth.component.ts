import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { constanst } from 'src/app/shared/constants/global.constant';
import { AuthUser, ResponseAuth, User } from './interfaces';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  public formTemplate!: FormGroup;
  protected isErrorAuthenticated: boolean = false;
  public hide: boolean = true;
  private _router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private readonly _authenticationService = inject(AuthService);

  protected message: string = '¡Bienvenido! Por favor, ingrese a su cuenta.';

  ngOnInit(): void {
    this.initFormFilters();
  }

  show() {
    this.hide = !this.hide;
  }

  private initFormFilters(): void {
    this.formTemplate = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (!this.formTemplate.valid) {
      this.formTemplate.markAllAsTouched();
      return;
    };

    const { username, password } = this.formTemplate.value;

    this.onAuthentication({ username, password });
  }

  private onAuthentication(params: AuthUser): void {
    this._authenticationService.login(params).pipe(
      tap((response: ResponseAuth) => this.onRedirectAuthentication(response.data.user)),
      catchError((response) => this.onHandleError(response)))
      .subscribe();
  }

  private onHandleError(response: any): Observable<void> {
    this.isErrorAuthenticated = true;
    this.message = response.error.message[0]
    return of();
  }

  private onRedirectAuthentication(params: User): void {

    this.isErrorAuthenticated = false;

    if (environment.workSpace === 'local') {
      this._router.navigateByUrl('/ventas');
      this.setLocalStorage(params)
    } else {
      // window.location.href = `${environment.baseUrl}/${environment.baseNsfIsicom}`;
    }
  }

  private setLocalStorage(params: User) {
    localStorage.setItem(constanst.SESSION_STORAGE, JSON.stringify(params) || '');
    localStorage.setItem(constanst.TOKEN_DECODE, JSON.stringify(params.access_token) || '');
  }
}
