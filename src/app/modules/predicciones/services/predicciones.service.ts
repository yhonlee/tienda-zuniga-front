import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PrediccionesFormService } from './predicciones-form.service';


@Injectable({
  providedIn: 'root'
})
export class PrediccionesService {

  private _http = inject(HttpClient);
  private _refreshTable = inject(PrediccionesFormService)

  guardarPrediccion(body: any): Observable<any> {

    const { sublinea_nombre, archivo, relativePath, id } = body
    const sublinea = {
      descripcion: sublinea_nombre,
      nombre_archivo: relativePath,
    }

    const formData = new FormData();
    formData.append('file', archivo[0], relativePath);
    formData.append('id_product', id.id)
    return this._http.post(`predictions/upload-csv`, formData)
  }

  public getProduct(product: string): Observable<any> {
    return this._http.get<any>(`products/get-by-name?name=${product}`).pipe(map((response) => { return response.data.products }));
  }

  public getGraphicPrediction(product: string, anio: string): Observable<any> {
    return this._http.get<any>(`predictions/get-prediction?id_product=${product}&year=${anio}`).pipe(map((response) => { return response }));
  }

  public detetePrediction(options: any): Observable<any> {
    return this._http.post(`predictions/delete-prediction`, options);
  }
}
