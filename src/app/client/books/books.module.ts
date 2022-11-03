import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BooksComponent} from './books.component';
import {BooksRoutingModule} from "./books-routing.module";
import {NavbarComponent} from './navbar/navbar.component';
import {MatSelectModule} from "@angular/material/select";
import {FooterComponent} from './footer/footer.component';
import {TableModule} from "./table/table.module";

@NgModule({
  declarations: [
    BooksComponent,
    NavbarComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    BooksRoutingModule,
    TableModule,
    MatSelectModule
  ]
})
export class BooksModule {
}
