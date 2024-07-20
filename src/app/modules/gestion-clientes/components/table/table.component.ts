import { Component, Input, inject } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GestionClientesFiltrosService } from '../../services/gestion-clientes-filtros.service';
import { Paginator } from 'src/app/shared/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { CreacionClientesPopupComponent } from '../creacion-clientes-popup/creacion-clientes-popup.component';
import { tap } from 'rxjs';
import { GestionClientesService } from '../../services/gestion-clientes.service';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  displayedColumns: string[] = ['name', 'identification_document', 'correo', 'direccion', 'estado', 'accion'];
  public dataSource!: MatTableDataSource<any>;
  private _refreshTable = inject(GestionClientesFiltrosService)
  private _clientesService = inject(GestionClientesService)
  public dialog = inject(MatDialog);
  private _dialogModules = inject(CustomDialogService);

  public paginador: Paginator = new Paginator();

  @Input() set datosClientes(datosClientes: any) {
    if (datosClientes) {
      this.dataSource = new MatTableDataSource(datosClientes.clients);
      this.setUpPaginador(datosClientes.pagination);
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
    this._clientesService.getClient(id).pipe(tap(data => {
      if (data.status == 1) {
        this.dialog.open(CreacionClientesPopupComponent, {
          width: '35vw',
          maxHeight: '95vh',
          autoFocus: false,
          panelClass: "crear_empleados",
          data: data.data.client
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
        title: `¿Seguro que quieres ${isInactive ? 'inactivar' : 'activar'} al cliente?`,
        buttonConfirmText: isInactive ? 'Inactivar' : 'Activar',
        buttonConfirmColor: 'color-primary'
      }
    };

    const serviceMethod = isInactive ? this._clientesService.inactiveClient(id) : this._clientesService.activeClient(id);
    const successMessage = `Se ${isInactive ? 'inactivó' : 'activó'} al cliente con éxito.`;

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