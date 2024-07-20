import { Component, Inject, OnInit, ViewChild, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, debounceTime, distinctUntilChanged, filter, finalize, of, shareReplay, startWith, switchMap, take, tap } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { GestionUsuariosService } from '../../services/gestion-usuarios.service';
import { GestionUsuariosFiltrosService } from '../../services/gestion-usuarios-filtros.service';

@Component({
  selector: 'app-creacion-usuario-popup',
  templateUrl: './creacion-usuario-popup.component.html',
  styleUrls: ['./creacion-usuario-popup.component.scss']
})
export class CreacionUsuarioPopupComponent implements OnInit {

  public roles$!: Observable<any>;
  //Quien Aprueba
  @ViewChild('autoAprobador') autoCompleteAprobador!: MatAutocomplete;
  selectedValueAprobador!: string;

  protected filteredOptionsAprobador$ = new BehaviorSubject<any[] | null>(null);
  protected loadingAprobador$ = new BehaviorSubject<boolean>(false);
  protected toHighlightAprobador: string = '';
  private _dialogModules = inject(CustomDialogService);
  private _formBuilder = inject(FormBuilder)
  private _gestionUsuarios = inject(GestionUsuariosService)
  private _refreshTable = inject(GestionUsuariosFiltrosService)
  public formEmpleado!: FormGroup;
  private dialogRef = inject(MatDialogRef<CreacionUsuarioPopupComponent>);
  public dataDialog = inject(MAT_DIALOG_DATA);

  public edit_mode: boolean = false;

  ngOnInit(): void {
    this.initFormEmpleados()
    this.onChangeFilterAprobador()
    this.listarRoles()
    this.llenarData()
  }

  private initFormEmpleados(): void {
    this.formEmpleado = this._formBuilder.group({
      usuario: ['', Validators.required],
      password: [''],
      rol: ['', Validators.required],
      employee: ['', Validators.required],
      id: []
    });
  }

  llenarData() {
    if (this.dataDialog) {
      this.edit_mode = true;
      const { username, id_rol, id_employee, id, employee_name, employee_lastname } = this.dataDialog
      1
      const user = {
        name: employee_name,
        lastname: employee_lastname,
        id: id_employee,
      }

      this.formEmpleado.get('usuario')?.patchValue(username)
      this.formEmpleado.get('rol')?.patchValue(id_rol)
      this.formEmpleado.get('employee')?.patchValue(user)
      this.formEmpleado.get('id')?.patchValue(id)

      this.clientAprobador(employee_name)
    }

    const passwordControl = this.formEmpleado.get('password');

    if (this.edit_mode) {
      passwordControl!.clearValidators();
    } else {
      passwordControl!.setValidators([Validators.required]);
    }

    passwordControl!.updateValueAndValidity();
  }

  public listarRoles() {
    this.roles$ = this._gestionUsuarios.getRoles().pipe(
      take(1),
      tap(data => {
        if (this.dataDialog) {
          const filters = data.find((valor: any) => valor.id == this.dataDialog.id_rol)
          this.formEmpleado.get('rol')?.setValue(filters);
        }
      })
    )
  }

  crearEmpleado() {
    const { usuario, password, employee, rol } = this.formEmpleado.value

    const body: any = {
      username: usuario,
      id_rol: rol.id,
      id_employee: Number(employee.id),
    }

    if (!this.edit_mode) {
      body.password = password
    }

    const params = {
      data: {
        icon: 'warning',
        title: this.edit_mode ? '¿Seguro que quieres actualizar al usuario?' : '¿Seguro que quieres crear al usuario?',
        buttonConfirmText: this.edit_mode ? 'Actualizar' : 'Crear',
        buttonConfirmColor: 'color-primary'
      }
    };

    this._dialogModules.openDialogConfirmation(params, (result) => {
      if (result) {
        if (!this.edit_mode) {
          this._gestionUsuarios.createUser(body).pipe(tap((data: any) => {
            if (data.status == 1) {
              this._dialogModules.openDialog({ data: 'Se creó al usuario con éxito.' }, (result) => {
                this.dialogRef.close()
                this._refreshTable.eventEmmiterPendiente(true)
              })
            } else {

            }
          })).subscribe()
        } else {
          const id = this.formEmpleado.get('id')?.value
          this._gestionUsuarios.refrestUser(id, body).pipe(tap((data: any) => {
            if (data.status == 1) {
              this._dialogModules.openDialog({ data: 'Se actualizó al usuario con éxito.' }, (result) => {
                this.dialogRef.close()
                this._refreshTable.eventEmmiterPendiente(true)
              })
            } else {

            }
          })).subscribe()
        }
      }
    })
  }

  //Aprobadores
  public get c(): { [key: string]: AbstractControl } {
    return this.formEmpleado.controls;
  }

  protected onFocusAutocompleteAprobador(): void {
    const { value } = this.formEmpleado.get('employee')!;
    if (!value) this.filteredOptionsAprobador$.next(null);
  }

  public onChangeFilterAprobador(): void {
    this.formEmpleado.get('employee')!.valueChanges.pipe(
      startWith<string>(''),
      filter(search => typeof search === 'string'),
      distinctUntilChanged(),
      debounceTime(500),
      filter((search) => search !== '' && search?.length > 0),
      tap((search) => {
        this.loadingAprobador$.next(true);
        this.toHighlightAprobador = search;
      }),
      switchMap(client => this.clientAprobador(client.toLowerCase())),
      tap((results) => {
        this.filteredOptionsAprobador$.next(results)
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    ).subscribe();
  }

  public onClearAutocompleteAprobador(): void {
    this.formEmpleado.get('employee')?.setValue('');
    this.filteredOptionsAprobador$.next(null);
    this.toHighlightAprobador = '';
    this.autoCompleteAprobador.options.forEach(option => option.deselect());
  }

  public onDisplayFnAprobador(value: any): string {
    if (typeof value === 'object' && value !== null && 'name' in value && 'lastname' in value) {
      return value.name + ' ' + value.lastname;
    }
    return '';
  }

  private clientAprobador(name: string): Observable<any> {
    return this._gestionUsuarios.getEmployee(name).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingAprobador$.next(false)));
  }

  onOptionSelectedAprobador(event: MatAutocompleteSelectedEvent) {
    const selectedValueAprobador = event.option.value;
  }
}
