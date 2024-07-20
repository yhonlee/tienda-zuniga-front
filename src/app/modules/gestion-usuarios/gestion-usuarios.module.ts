import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionUsuariosRoutingModule } from './gestion-usuarios-routing.module';
import { GestionUsuariosComponent } from './gestion-usuarios.component';
import { TableComponent } from './components/table/table.component';
import { FiltrosComponent } from './components/filtros/filtros.component';
import { getSpanishPaginatorIntl } from 'src/app/shared/language/spanish-paginator-intl';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CreacionUsuarioPopupComponent } from './components/creacion-usuarios-popup/creacion-usuario-popup.component';
import { SortByPipeModule } from "../../shared/pipes/sort-by.pipe";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FirstLetterUppercasePipeModule } from "../../shared/pipes/first-letter-uppercase.pipe";
import { HighlightPipeModule } from "../../shared/pipes/highlight.pipe";
import { GestionUsuariosService } from './services/gestion-usuarios.service';
import { GlobalProviders } from 'src/app/shared/interceptors/global.interceptor';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { StateClassButtonPipeModule } from "../../shared/pipes/state-class-button.pipe";
import { ActualizarPasswordPopupComponent } from './components/actualizar-password-popup/actualizar-password-popup.component';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';


@NgModule({
    declarations: [
        GestionUsuariosComponent,
        TableComponent,
        FiltrosComponent,
        CreacionUsuarioPopupComponent,
        ActualizarPasswordPopupComponent
    ],
    providers: [
        GestionUsuariosService,
        SnackBarService,
        GlobalProviders,
        { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() }
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        GestionUsuariosRoutingModule,
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
    ]
})
export class GestionUsuariosModule { }
