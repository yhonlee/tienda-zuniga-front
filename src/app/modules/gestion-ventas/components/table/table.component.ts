import { Component, Input, inject } from '@angular/core';
import { GestionVentasService } from '../../services/gestion-ventas.service';
import { GestionVentasFiltrosService } from '../../services/gestion-ventas-filtros.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';
import { Paginator } from 'src/app/shared/interfaces';
import { PageEvent } from '@angular/material/paginator';
import { DetalleVentaComponent } from '../detalle-venta/detalle-venta.component';
import { tap } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  displayedColumns: string[] = ['name', 'document', 'price', 'created', 'accion'];
  public dataSource!: MatTableDataSource<any>;
  private _refreshTable = inject(GestionVentasFiltrosService)
  private _productosService = inject(GestionVentasService)
  public dialog = inject(MatDialog);
  private _dialogModules = inject(CustomDialogService);
  public paginador: Paginator = new Paginator();

  @Input() set datosVentas(datosVentas: any) {
    if (datosVentas) {
      this.dataSource = new MatTableDataSource(datosVentas.sales);
      this.setUpPaginador(datosVentas.pagination);
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

  openEdit(element: any) {

    this._productosService.getDetailSales(element.id).pipe(tap((data: any) => {
      if (data.status = 1) {
        const dataSail = data.data.sale_detail
        const body = {
          InfoClient: element,
          dataSail
        }

        this.dialog.open(DetalleVentaComponent, {
          width: '35vw',
          maxHeight: '95vh',
          autoFocus: false,
          panelClass: "crear_empleados",
          data: body
        })

      }
    })).subscribe()
  }


}
