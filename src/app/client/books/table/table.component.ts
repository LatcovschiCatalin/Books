import {Component, OnInit} from '@angular/core';
import {QueryParamsService} from "../../services/query-params.service";
import {CrudService} from "../../../server/crud/crud.service";
import {BookPopupComponent} from "../shared/book-popup/book-popup.component";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

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
      key: 'genre',
      name: 'Genre',
    },
  ];
  actions = [
    {
      key: 'edit',
      icon: '/assets/icons/edit.png'
    },
    {
      key: 'delete',
      icon: '/assets/icons/trash.png'
    }
  ]

  constructor(
    public qpService: QueryParamsService,
    public service: CrudService
  ) {
  }

  ngOnInit() {
    this.qpService.deleteParam('id');
  }

}


