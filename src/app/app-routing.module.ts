import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransferTransactionComponent } from './transfer-transaction/transfer-transaction.component';


const routes: Routes = [  {
  path: '',
  component: TransferTransactionComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
