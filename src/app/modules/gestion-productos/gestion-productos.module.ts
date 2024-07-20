import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionProductosRoutingModule } from './gestion-productos-routing.module';
import { TableComponent } from './components/table/table.component';
import { FiltrosComponent } from './components/filtros/filtros.component';
import { GestionProductosComponent } from './gestion-productos.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { getSpanishPaginatorIntl } from 'src/app/shared/language/spanish-paginator-intl';
import { GestionProductosService } from './services/gestion-productos.service';
import { GlobalProviders } from 'src/app/shared/interceptors/global.interceptor';
import { CreacionProductosPopupComponent } from './components/creacion-productos-popup/creacion-productos-popup.component';
import { SortByPipeModule } from "../../shared/pipes/sort-by.pipe";
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { StateClassButtonPipeModule } from "../../shared/pipes/state-class-button.pipe";


@NgModule({
    declarations: [
        GestionProductosComponent,
        TableComponent,
        FiltrosComponent,
        CreacionProductosPopupComponent
    ],
    providers: [
        GestionProductosService,
        GlobalProviders,
        { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() }
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        GestionProductosRoutingModule,
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
    ]
})
export class GestionProductosModule { }
