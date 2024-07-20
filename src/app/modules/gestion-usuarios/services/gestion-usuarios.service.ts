import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GestionUsuariosFiltrosService } from './gestion-usuarios-filtros.service';

@Injectable({
  providedIn: 'root'
})
export class GestionUsuariosService {

  private _http = inject(HttpClient);
  private _refreshTable = inject(GestionUsuariosFiltrosService)

  public createUser(body: any) {
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
  }

  public getListEmployees(): Observable<any> {
    const paginador = this._refreshTable.paginadorTablaPendientes()
    const filtros = this._refreshTable.filtrosBandeja()
    const ids = filtros?.estados != null ? filtros.estados.map((item: any) => item.id).join(',') : '';

    const nombre = filtros?.name ? `fullname=${filtros.name}&` : '';
    const username = filtros?.username ? `username=${filtros.username}&` : '';
    const estados = filtros?.estados ? `id_states=${ids}&` : ''

    return this._http.get<any>(`users/get-user-tray?${nombre}${estados}${username}page=${paginador.s_page || 1}&elements_per_page=${paginador.s_per_page || 10}`).pipe(map((response) => { return response.data }));
  }

  public getUser(id: number): Observable<any> {
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
  }

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
