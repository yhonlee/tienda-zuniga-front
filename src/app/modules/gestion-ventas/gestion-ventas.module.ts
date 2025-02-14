import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionVentasRoutingModule } from './gestion-ventas-routing.module';
import { TableComponent } from './components/table/table.component';
import { FiltrosComponent } from './components/filtros/filtros.component';
import { DetalleVentaComponent } from './components/detalle-venta/detalle-venta.component';
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
import { GestionVentasService } from './services/gestion-ventas.service';
import { GlobalProviders } from 'src/app/shared/interceptors/global.interceptor';
import { getSpanishPaginatorIntl } from 'src/app/shared/language/spanish-paginator-intl';
import { GestionVentasComponent } from './gestion-ventas.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FirstLetterUppercasePipeModule } from "../../shared/pipes/first-letter-uppercase.pipe";
import { HighlightPipeModule } from "../../shared/pipes/highlight.pipe";


@NgModule({
    declarations: [
        TableComponent,
        FiltrosComponent,
        DetalleVentaComponent,
        GestionVentasComponent
    ],
    providers: [
        GestionVentasService,
        GlobalProviders,
        { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() }
    ],
    imports: [
        GestionVentasRoutingModule,
        CommonModule,
        HttpClientModule,
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
        MatAutocompleteModule,
        SortByPipeModule,
        StateClassButtonPipeModule,
        FirstLetterUppercasePipeModule,
        HighlightPipeModule
    ]
})
export class GestionVentasModule { }
