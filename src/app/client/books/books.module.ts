import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BooksComponent} from './books.component';
import {BooksRoutingModule} from "./books-routing.module";
import {NavbarComponent} from './navbar/navbar.component';
import {FooterComponent} from './footer/footer.component';
import {TableModule} from "./table/table.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {CrudService} from "../../server/crud/crud.service";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    BooksComponent,
    NavbarComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BooksRoutingModule,
    TableModule,
    MatSelectModule,
  ],
  providers: [CrudService]
})
export class BooksModule {
}
