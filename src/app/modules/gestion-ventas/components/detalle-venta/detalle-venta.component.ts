import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.component.html',
  styleUrls: ['./detalle-venta.component.scss']
})
export class DetalleVentaComponent {
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['product_name', 'quantity', 'uni_price', 'total_price'];

  private dialogRef = inject(MatDialogRef<DetalleVentaComponent>);
  public dataDialog = inject(MAT_DIALOG_DATA);


  ngOnInit(){
    this.dataSource = this.dataDialog.dataSail
  }
}
