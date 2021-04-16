import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubProductTableComponent } from './sub-product-table.component';
import { SharedModule } from '../../../shared/shared.module';
import { SubProductTableService } from './sub-product-table.service';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SubProductTableComponent],
  exports: [
    SubProductTableComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
    SubProductTableService
  ]
})
export class SubProductTableModule { }
