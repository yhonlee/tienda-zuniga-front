import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { RealizarVentaBuscadorService } from './realizar-venta-buscador.service';

@Injectable({
  providedIn: 'root'
})
export class RealizarVentaService {

  private _http = inject(HttpClient);
  private _refreshTable = inject(RealizarVentaBuscadorService)

  /*   public createUser(body: any) {
      return this._http.post(`users/create`, body)
    }
  
    public getEmployee(name: any): Observable<any> {
      return this._http.get<any>(`employees/get-employees-by-name?full_name=${name}`).pipe(map((response: any) => { return response.data.employees }));
    }
  
    public getRoles(): Observable<any> {
      return this._http.get<any>(`roles/get-all`).pipe(map((response: any) => { return response.data.roles }));
    }
  
    public getStates(): Observable<any> {
      return this._http.get<any>('states/get-all').pipe(map((response) => { return response.data.states }));
    } */

  public getClient(nombre: string): Observable<any> {
    return this._http.get<any>(`clients/get-by-name?business_name=${nombre}`).pipe(map((response) => { return response.data.clients }));
  }

  public getClientByDocument(document: string): Observable<any> {
    return this._http.get<any>(`clients/get-by-identification-document?identification_document=${document}`).pipe(map((response) => { return response.data.clients }));
  }

  public getProduct(nombre: string): Observable<any> {
    return this._http.get<any>(`products/get-by-name?name=${nombre}`).pipe(map((response) => { return response.data.products }));
  }

  public createVenta(body: any) {
    return this._http.post(`sales/create`, body)
  }






  /*   public getUser(id: number): Observable<any> {
      return this._http.get<any>(`users/get-by-id/${id}`).pipe(map((response) => { return response }));
    }
  
    public refrestUser(id: number, body: any): Observable<any> {
      return this._http.put<any>(`users/update/${id}`, body)
    }
  
    public inactiveUser(id: number): Observable<any> {
      return this._http.patch<any>(`users/inactivate-by-id/${id}`, {})
    }
  
    public activeUser(id: number): Observable<any> {
      return this._http.patch<any>(`users/activate-by-id/${id}`, {})
    }
  
    public updatePasswordAdmin(id: number, password: any): Observable<any> {
      return this._http.patch<any>(`users/update-password-admin-role/${id}`, password)
    }
  
    public updatePassword(id: number, password: any): Observable<any> {
      return this._http.patch<any>(`users/update-password-user-role/${id}`, password)
    } */

  /*  public getEmployee(name: any): Observable<any> {
     return this._http.get<any>(`employees/get-employees-by-name?full_name=${name}`).pipe(map((response: ResponseJobPosition) => { return response.data.job_positions }));
   } */

  /*  public getWorkDepartment(): Observable<DepartmentsOfWork[]> {
     return this._http.get<ResponseGestionEmpleados>('departments-of-work/get-all').pipe(map((response: ResponseGestionEmpleados) => { return response.data.departments_of_work }));
   }
 
   public getJobPosition(id_department: any): Observable<JobPosition[]> {
     return this._http.get<ResponseJobPosition>(`job-positions/get-by-department-id?id_work_department=${id_department}`).pipe(map((response: ResponseJobPosition) => { return response.data.job_positions }));
   }
 
   public createEmployee(body: any) {
     return this._http.post(`employees/create`, body)
   } */
}
