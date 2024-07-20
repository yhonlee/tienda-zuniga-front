import { Component, Input, ViewChild, inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Paginator } from 'src/app/shared/interfaces';
import { GestionProductosFiltrosService } from '../../services/gestion-productos-filtros.service';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';
import { GestionProductosService } from '../../services/gestion-productos.service';
import { tap } from 'rxjs';
import { CreacionProductosPopupComponent } from '../creacion-productos-popup/creacion-productos-popup.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  displayedColumns: string[] = ['name', 'description', 'price', 'stock', 'state_name', 'accion'];
  public dataSource!: MatTableDataSource<any>;
  private _refreshTable = inject(GestionProductosFiltrosService)
  private _productosService = inject(GestionProductosService)
  public dialog = inject(MatDialog);
  private _dialogModules = inject(CustomDialogService);
  public paginador: Paginator = new Paginator();

  @Input() set datosProductos(datosProductos: any) {
    if (datosProductos) {
      this.dataSource = new MatTableDataSource(datosProductos.products);
      this.setUpPaginador(datosProductos.pagination);
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
    this._productosService.getProduct(id).pipe(tap(data => {
      if (data.status == 1) {
        this.dialog.open(CreacionProductosPopupComponent, {
          width: '35vw',
          maxHeight: '95vh',
          autoFocus: false,
          panelClass: "crear_empleados",
          data: data.data.product
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
        title: `¿Seguro que quieres ${isInactive ? 'inactivar' : 'activar'} el producto?`,
        buttonConfirmText: isInactive ? 'Inactivar' : 'Activar',
        buttonConfirmColor: 'color-primary'
      }
    };

    const serviceMethod = isInactive ? this._productosService.inactiveProduct(id) : this._productosService.activeProduct(id);
    const successMessage = `Se ${isInactive ? 'inactivó' : 'activó'} el producto con éxito.`;

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
