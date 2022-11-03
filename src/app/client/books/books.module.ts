import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BooksComponent} from './books.component';
import {BooksRoutingModule} from "./books-routing.module";
import {NavbarComponent} from './navbar/navbar.component';
import {MatSelectModule} from "@angular/material/select";
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    BooksComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    BooksRoutingModule,
    MatSelectModule
  ]
})
export class BooksModule {
}
