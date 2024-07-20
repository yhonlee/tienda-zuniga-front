import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable()
export class GraficosVentasService {

  private _http = inject(HttpClient);

  public getProduct(product: string): Observable<any> {
    return this._http.get<any>(`products/get-by-name?name=${product}`).pipe(map((response) => { return response.data.products }));
  }

  public getGraphic(product: string, anio: string): Observable<any> {
    return this._http.get<any>(`sales-detail/get-sales-detail?id_product=${product}&year=${anio}`).pipe(map((response) => { return response }));
  }

  public getDetails(product: string, anio: string): Observable<any> {
    return this._http.get<any>(`sales/extra-information?id_product=${product}&year=${anio}`).pipe(map((response) => { return response }));
  }

}
