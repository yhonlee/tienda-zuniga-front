import { Component, Input, inject } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GestionEmpleadosService } from '../../services/gestion-empleados.service';
import { Paginator } from 'src/app/shared/interfaces';
import { GestionEmpleadosFiltrosService } from '../../services/gestion-empleados-filtros.service';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs';
import { CreacionEmpleadosPopupComponent } from '../creacion-empleados-popup/creacion-empleados-popup.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  displayedColumns: string[] = ['name', 'identification_document', 'job_position', 'work_department', 'salary', 'contract_date', 'estado', 'accion'];
  public dataSource!: MatTableDataSource<any>;
  private _refreshTable = inject(GestionEmpleadosFiltrosService)
  private _employeesServices = inject(GestionEmpleadosService)
  public dialog = inject(MatDialog);
  private _dialogModules = inject(CustomDialogService);

  public paginador: Paginator = new Paginator();

  @Input() set datosEmpleados(datosEmpleados: any) {
    if (datosEmpleados) {
      this.dataSource = new MatTableDataSource(datosEmpleados.employees);
      this.setUpPaginador(datosEmpleados.pagination);
    } else {
      this.dataSource = new MatTableDataSource();
    }
  }

  private setUpPaginador(pagination: any): void {
    this.paginador = this.paginador.onSetUpPaginador(pagination);
  }

  public onHideDisplayedPaginator(paginador: Paginator): boolean {
    return this.paginador.onHideDisplayedPaginator(paginador);
  }

  public onChangePage(event: PageEvent): void {
    this.paginador = this.paginador.onChangePage(event);
    this._refreshTable.tablaPendiente(event.pageIndex + 1, event.pageSize)
    this._refreshTable.eventEmmiterPendiente(true)
  }

  openEdit(id: number) {
    this._employeesServices.getEmployees(id).pipe(tap(data => {
      if (data.status == 1) {
        this.dialog.open(CreacionEmpleadosPopupComponent, {
          width: '35vw',
          maxHeight: '95vh',
          autoFocus: false,
          panelClass: "crear_empleados",
          data: data.data.employee
        })
      } else {
        this._dialogModules.openDialog({ data: 'Ocurrió un error, vuelva a intentarlo.' }, (result) => { })
      }
    })).subscribe()
  }

  changeStateCliente(id: number, id_state: number) {
    const isInactive = id_state == 10;
    const params = {
      data: {
        icon: 'warning',
        title: `¿Seguro que quieres ${isInactive ? 'inactivar' : 'activar'} al empleado?`,
        buttonConfirmText: isInactive ? 'Inactivar' : 'Activar',
        buttonConfirmColor: 'color-primary'
      }
    };

    const serviceMethod = isInactive ? this._employeesServices.inactiveEmployees(id) : this._employeesServices.activeEmployees(id);
    const successMessage = `Se ${isInactive ? 'inactivó' : 'activó'} al empleado con éxito.`;

    this._dialogModules.openDialogConfirmation(params, (result) => {
      if (result) {
        serviceMethod.pipe(tap((data: any) => {
          if (data.status == 1) {
            this._dialogModules.openDialog({ data: successMessage }, () => {
              this._refreshTable.eventEmmiterPendiente(true);
            });
          } else {
            this._dialogModules.openDialog({ data: 'Ocurrió un error, vuelva a intentarlo.' }, (result) => { })
          }
        })).subscribe();
      }
    });
  }
}
