import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionClientesComponent } from './gestion-clientes.component';

const routes: Routes = [
  {
    path: '', children: [
      {
        path: '',
        component: GestionClientesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionClientesRoutingModule { }
