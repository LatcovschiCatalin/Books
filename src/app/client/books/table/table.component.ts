import {Component, OnInit} from '@angular/core';
import {QueryParamsService} from "../../services/query-params.service";
import {CrudService} from "../../../server/crud/crud.service";
import {BookPopupComponent} from "../shared/book-popup/book-popup.component";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  mode = 'dark'
  popup = BookPopupComponent;
  columns = [
    {
      key: 'id',
      name: 'Id',
    },
    {
      key: 'title',
      name: 'Title',
    },
    {
      key: 'author',
      name: 'Author',
    },
    {
      key: 'image',
      name: 'Image',
      type: 'image'
    },
    {
      key: 'genre',
      name: 'Genre',
    },
  ];
  actions: object[] = []

  constructor(
    public qpService: QueryParamsService,
    public service: CrudService,
    private cookieService: CookieService
  ) {
    this.mode = this.cookieService.get('mode') || 'dark';
    this.actions = [
      {
        key: 'edit',
        icon: '/assets/icons/' + this.mode + '/edit.png'
      },
      {
        key: 'delete',
        icon: '/assets/icons/' + this.mode + '/trash.png'
      }
    ]
  }

  ngOnInit() {
    this.qpService.deleteParam('id');
  }

}


