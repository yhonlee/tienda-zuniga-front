import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionClientesRoutingModule } from './gestion-clientes-routing.module';
import { CreacionClientesPopupComponent } from './components/creacion-clientes-popup/creacion-clientes-popup.component';
import { TableComponent } from './components/table/table.component';
import { FiltrosComponent } from './components/filtros/filtros.component';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { SortByPipeModule, StateClassButtonPipeModule } from 'src/app/shared/pipes';
import { GestionClientesService } from './services/gestion-clientes.service';
import { GlobalProviders } from 'src/app/shared/interceptors/global.interceptor';
import { getSpanishPaginatorIntl } from 'src/app/shared/language/spanish-paginator-intl';
import { GestionClientesComponent } from './gestion-clientes.component';


@NgModule({
  declarations: [
    GestionClientesComponent,
    CreacionClientesPopupComponent,
    TableComponent,
    FiltrosComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    GestionClientesRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    SortByPipeModule,
    StateClassButtonPipeModule
  ],
  exports:[
    CreacionClientesPopupComponent
  ],
  providers: [
    GestionClientesService,
    GlobalProviders,
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() }
  ],
})
export class GestionClientesModule { }
