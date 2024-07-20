import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionEmpleadosComponent } from './gestion-empleados.component';

const routes: Routes = [
  {
    path: '', children: [
      {
        path: '',
        component: GestionEmpleadosComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionEmpleadosRoutingModule { }
