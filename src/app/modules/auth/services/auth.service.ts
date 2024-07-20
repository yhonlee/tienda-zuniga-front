import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthUser, ResponseAuth } from '../interfaces';

@Injectable()
export class AuthService {

  private _http = inject(HttpClient);

  public login(body: AuthUser): Observable<ResponseAuth> {
    return this._http.post<ResponseAuth>('auth/login', body);
  }
}
