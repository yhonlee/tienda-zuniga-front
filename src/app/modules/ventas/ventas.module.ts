import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentasRoutingModule } from './ventas-routing.module';
import { VentasComponent } from './ventas.component';
import { BuscadorClienteComponent } from './components/buscador-cliente/buscador-cliente.component';
import { BuscadorProductosComponent } from './components/buscador-productos/buscador-productos.component';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FirstLetterUppercasePipeModule, HighlightPipeModule, SortByPipeModule, StateClassButtonPipeModule } from 'src/app/shared/pipes';
import { RealizarVentaService } from './services/realizar-venta.service';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { GlobalProviders } from 'src/app/shared/interceptors/global.interceptor';
import { getSpanishPaginatorIntl } from 'src/app/shared/language/spanish-paginator-intl';
import { GestionClientesService } from '../gestion-clientes/services/gestion-clientes.service';


@NgModule({
  declarations: [
    VentasComponent,
    BuscadorClienteComponent,
    BuscadorProductosComponent
  ],
  imports: [
    CommonModule,
    VentasRoutingModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogModule,
    MatAutocompleteModule,
    SortByPipeModule,
    FirstLetterUppercasePipeModule,
    HighlightPipeModule,
    StateClassButtonPipeModule
  ],
  providers: [
    RealizarVentaService,
    GestionClientesService,
    SnackBarService,
    GlobalProviders,
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() }
  ],
})
export class VentasModule { }
