import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {QueryParamsService} from "../../../services/query-params.service";

@Component({
  selector: 'app-books-genre',
  templateUrl: './books-genre.component.html',
  styleUrls: ['./books-genre.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BooksGenreComponent implements OnInit {

  @Output() setGenre = new EventEmitter;
  @Input() genres: any;
  selected = 'Select';

  constructor(private qpService: QueryParamsService) {
  }

  ngOnInit(): void {
    this.qpService.getParamSubs('genre').subscribe((res) => {
      this.selected = res;
    })
  }

  getGenre(e: any) {
    this.qpService.updateParam('genre', e)
    this.setGenre.emit(e)
  }

}
