import { Component, Inject, OnInit, inject } from '@angular/core';
import { Observable, filter, of, startWith, switchMap, take, tap } from 'rxjs';
import { GestionEmpleadosService } from '../../services/gestion-empleados.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import * as moment from 'moment';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';
import { GestionEmpleadosFiltrosService } from '../../services/gestion-empleados-filtros.service';

@Component({
  selector: 'app-creacion-empleados-popup',
  templateUrl: './creacion-empleados-popup.component.html',
  styleUrls: ['./creacion-empleados-popup.component.scss']
})
export class CreacionEmpleadosPopupComponent implements OnInit {

  private subs: SubSink = new SubSink();

  public workdepartments$!: Observable<any>;
  public jobPosition$!: Observable<any>;

  private _dialogModules = inject(CustomDialogService);
  private _formBuilder = inject(FormBuilder)
  private _gestionEmpleadosService = inject(GestionEmpleadosService)
  private _refreshTable = inject(GestionEmpleadosFiltrosService)
  public formEmpleado!: FormGroup;

  private dialogRef = inject(MatDialogRef<CreacionEmpleadosPopupComponent>);
  public dataDialog = inject(MAT_DIALOG_DATA);

  public edit_mode: boolean = false;

  ngOnInit(): void {
    this.initFormEmpleados()
    this.listarWorkDepartments()
    this.onChangeWorkDepartment()
    this.llenarData()
  }

  private initFormEmpleados(): void {
    this.formEmpleado = this._formBuilder.group({
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      dni: ['', Validators.required],
      job_position: ['', Validators.required],
      work_department: ['', Validators.required],
      salary: ['', Validators.required],
      date_contract: ['', Validators.required],
      address: ['', Validators.required],
      id: []
    });
  }

  llenarData() {
    if (this.dataDialog) {
      this.edit_mode = true;
      const { address, contract_date, id_job_position, id_work_department, identification_document, name, lastname, salary, id } = this.dataDialog

      this.formEmpleado.get('name')?.patchValue(name)
      this.formEmpleado.get('last_name')?.patchValue(lastname)
      this.formEmpleado.get('dni')?.patchValue(identification_document)


      this.formEmpleado.get('salary')?.patchValue(salary)
      this.formEmpleado.get('date_contract')?.patchValue(contract_date)
      this.formEmpleado.get('address')?.patchValue(address)
      this.formEmpleado.get('id')?.patchValue(id)
    }
  }


  public listarWorkDepartments() {
    this.workdepartments$ = this._gestionEmpleadosService.getWorkDepartment().pipe(
      take(1),
      tap(data => {
        if (this.dataDialog) {
          const filters = data.find((valor: any) => valor.id == this.dataDialog.id_work_department)
          this.formEmpleado.get('work_department')?.patchValue(filters)
          this.listarJobPosition(this.dataDialog.id_work_department)
        }
      })
    )
  }

  onChangeWorkDepartment(): void {
    this.subs.sink = this.formEmpleado.get('work_department')?.valueChanges.pipe(
      startWith<any>(''),
      filter((data) => data != ''),
      tap(_ => {
        this.formEmpleado.get('job_position')?.reset('');
        this.formEmpleado.get('job_position')?.enable();
        this.jobPosition$ = of([])
      }),
      switchMap(value => this.listarJobPosition(value.id)),
    ).subscribe();
  }

  listarJobPosition(id_work_department: number) {
    this.jobPosition$ = this._gestionEmpleadosService.getJobPosition(id_work_department).pipe(
      take(1),
      tap(data => {
        if (this.dataDialog) {
          const filters = data.find((valor: any) => valor.id == this.dataDialog.id_job_position)
          this.formEmpleado.get('job_position')?.patchValue(filters)
        }
      }),
    );
    return this.jobPosition$;
  }

  crearEmpleado() {
    const { name, last_name, dni, job_position, work_department, salary, date_contract, address } = this.formEmpleado.value

    const body = {
      name,
      lastname: last_name,
      identification_document: dni,
      id_job_position: Number(job_position.id),
      id_work_department: work_department.id,
      salary: Number(salary),
      contract_date: moment(date_contract).format('YYYY-MM-DD'),
      address
    }

    const params = {
      data: {
        icon: 'warning',
        title: this.edit_mode ? '¿Seguro que quieres actualizar al empleado?' : '¿Seguro que quieres crear al empleado?',
        buttonConfirmText: this.edit_mode ? 'Actualizar' : 'Crear',
        buttonConfirmColor: 'color-primary'
      }
    };

    this._dialogModules.openDialogConfirmation(params, (result) => {
      if (result) {
        if (!this.edit_mode) {
          this._gestionEmpleadosService.createEmployee(body).pipe(tap((data: any) => {
            if (data.status == 1) {
              this._dialogModules.openDialog({ data: 'Se creó el empleado con éxito.' }, (result) => {
                this.dialogRef.close()
                this._refreshTable.eventEmmiterPendiente(true)
              })
            } else {

            }
          })).subscribe()
        } else {
          const id = this.formEmpleado.get('id')?.value
          this._gestionEmpleadosService.refrestEmployees(id, body).pipe(tap((data: any) => {
            if (data.status == 1) {
              this._dialogModules.openDialog({ data: 'Se actualizó el empleado con éxito.' }, (result) => {
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
}
