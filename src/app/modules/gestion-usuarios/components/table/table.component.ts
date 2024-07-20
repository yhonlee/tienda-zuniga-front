import { Component, Input, ViewChild, inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Paginator } from 'src/app/shared/interfaces';
import { GestionUsuariosFiltrosService } from '../../services/gestion-usuarios-filtros.service';
import { GestionUsuariosService } from '../../services/gestion-usuarios.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';
import { CreacionUsuarioPopupComponent } from '../creacion-usuarios-popup/creacion-usuario-popup.component';
import { tap } from 'rxjs';
import { ActualizarPasswordPopupComponent } from '../actualizar-password-popup/actualizar-password-popup.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  displayedColumns: string[] = ['fullname', 'role_name', 'username', 'state_name', 'accion'];
  public dataSource!: MatTableDataSource<any>;
  private _refreshTable = inject(GestionUsuariosFiltrosService)
  private _usuariosService = inject(GestionUsuariosService)
  public dialog = inject(MatDialog);
  private _dialogModules = inject(CustomDialogService);

  public paginador: Paginator = new Paginator();

  @Input() set datosUsuarios(datosUsuarios: any) {
    if (datosUsuarios) {
      this.dataSource = new MatTableDataSource(datosUsuarios.users);
      this.setUpPaginador(datosUsuarios.pagination);
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
    this._usuariosService.getUser(id).pipe(tap(data => {
      if (data.status == 1) {
        this.dialog.open(CreacionUsuarioPopupComponent, {
          width: '35vw',
          maxHeight: '95vh',
          autoFocus: false,
          panelClass: "crear_empleados",
          data: data.data.user
        })
      } else {
        this._dialogModules.openDialog({ data: 'Ocurrió un error, vuelva a intentarlo.' }, (result) => { })
      }
    })).subscribe()
  }

  openChangePassword(id: number) {
    this._usuariosService.getUser(id).pipe(tap(data => {
      if (data.status == 1) {
        this.dialog.open(ActualizarPasswordPopupComponent, {
          width: '35vw',
          maxHeight: '95vh',
          autoFocus: false,
          panelClass: "crear_empleados",
          data: id
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
        title: `¿Seguro que quieres ${isInactive ? 'inactivar' : 'activar'} al usuario?`,
        buttonConfirmText: isInactive ? 'Inactivar' : 'Activar',
        buttonConfirmColor: 'color-primary'
      }
    };

    const serviceMethod = isInactive ? this._usuariosService.inactiveUser(id) : this._usuariosService.activeUser(id);
    const successMessage = `Se ${isInactive ? 'inactivó' : 'activó'} al usuario con éxito.`;

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
