import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomTableComponent} from './custom-table/custom-table.component';
import {CustomFileUploadComponent} from './custom-file-upload/custom-file-upload.component';
import {BookPopupComponent} from './book-popup/book-popup.component';
import {CustomFormComponent} from './custom-form/custom-form.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";
import {MatDialogModule} from "@angular/material/dialog";
import {CustomFormService} from "./custom-form/custom-form.service";


@NgModule({
  declarations: [
    CustomTableComponent,
    CustomFileUploadComponent,
    BookPopupComponent,
    CustomFormComponent
  ],
  exports: [
    CustomTableComponent
  ],
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatInputModule,
    FormsModule,
    MatTableModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  providers: [CustomFormService]
})
export class SharedModule {
}
