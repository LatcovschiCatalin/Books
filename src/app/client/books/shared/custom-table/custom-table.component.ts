import {Component, Input, OnDestroy, OnInit, ViewEncapsulation,} from '@angular/core';
import {QueryParamsService} from "../../../services/query-params.service";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {CustomFormService} from "../custom-form/custom-form.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class CustomTableComponent implements OnInit, OnDestroy {
  @Input() tableConfig: any;

  @Input() set columns(event: any) {
    this.sourceColumns = event;
    // @ts-ignore
    this.displayedColumns = [...this.sourceColumns?.map(el => el.key), 'actions'];
  };


  displayedColumns: any;
  sourceColumns: any;

  limit = [10, 20, 50, 100];
  limit_docs = 10;
  page = 1;
  data: any;
  changedData: any;
  pageData: any;
  show_sort = false;
  searchTerm = '';
  sort = '';
  order = 'ASC'
  observables: Subscription[] = [];
  width = window.innerWidth - 370;
  fieldWidth: any;
  genre = '';
  genres: string[] = [];

  constructor(public dialog: MatDialog, private qpService: QueryParamsService, private route: ActivatedRoute, public customFormService: CustomFormService) {
  }

  ngOnInit(): void {
    this.showSort(false);
    this.fieldWidth = (this.width - 126) / this.width * 100 / (this.displayedColumns.length - 1) / 100 * this.width;
    this.observables.push(this.route.queryParams.subscribe(res => {
      this.sort = res['sort'] || '';
      this.order = res['order'] || 'ASC';
      this.searchTerm = res['searchTerm'] || '';
      if (res['page']) {
        this.page = Number(res['page']);
      } else {
        this.qpService.updateParam('page', 1);
        this.page = 1;
      }

      if (res['genre']) {
        this.genre = res['genre'];
      }

      if (res['limit']) {
        this.limit_docs = Number(res['limit']);
      } else {
        this.qpService.updateParam('limit', 10);
        this.limit_docs = 10;
      }
    }))
    this.getData();

  }

  onlyUnique(value: string, index: number, self: any) {
    return self.indexOf(value) === index;
  }

  showSort(show: boolean) {
    this.show_sort = show;
    if (!this.show_sort) {
      this.qpService.deleteParams({'sort': null, 'order': null});
    }
  }

  sortData(sort: any, order?: any) {
    if (this.show_sort) {
      let field = '';
      let ord = '';
      this.observables.push(this.route.queryParams.subscribe(res => {
        field = res['sort'] || '';
        ord = res['order'] === 'ASC' && field === sort ? 'DES' : 'ASC';
      }));
      ord = order ? order : ord;
      this.qpService.updateParams({sort: sort, order: ord});
      this.sort = sort;
      this.order = ord;
      this.changedData.sort((a: any, b: any) => (ord == 'DES' ? a[sort] < b[sort] : a[sort] > b[sort]) ? 1 : -1)
      this.refreshPage();
    }
  }

  search() {
    this.qpService.updateParam('searchTerm', this.searchTerm);
    this.changedData = this.data.filter((el: any) => {
      let keys = Object.keys(el).filter(key => (
        key !== 'image'
      ))
      let finalRow: any = {};
      for (let a = 0; a < keys.length; a++) {
        finalRow[keys[a]] = el[keys[a]]
      }
      return JSON.stringify(finalRow).toLowerCase().includes(this.searchTerm);
    })
    this.sortData(this.sort, this.order);
    this.getGenre(this.genre);
    this.refreshPage();

  }

  getData() {
    this.tableConfig?.service.get().subscribe((data: any) => {
      this.qpService.updateParam('totalItems', data.length);
      let genres: string[] = [];
      for (let i = 0; i < data.length; i++) {
        genres.push(data[i]['genre'].toLowerCase())
      }
      this.genres = genres.filter(this.onlyUnique);
      this.data = data || [];
      this.search();
      this.getGenre(this.genre);
      this.refreshPage();
    });
  }

  onDelete(id: any) {
    if (window.confirm('Are you sure you want to delete?')) {
      this.tableConfig?.service.deleteById(id).subscribe(() => {
        this.getData();
      });
    }
  }

  onPaginateChange(e: any) {
    if (e.pageSize !== this.limit_docs) {
      this.limit_docs = e.pageSize;
      this.page = 1;
      this.qpService.updateParam('limit', this.limit_docs);
    } else if (e.pageIndex + 1 !== this.page) {
      this.page = Number(e.pageIndex) + 1;
      this.qpService.updateParam('page', this.page);
    }
    this.refreshPage();
  }

  refreshPage() {
    let total = this.changedData?.length;
    let finalData: object[] = [];
    let initial = (this.page - 1) * this.limit_docs;
    let next = initial + this.limit_docs;
    let last = next > total ? total : next;
    for (let i = initial; i < last; i++) {
      finalData.push(this.changedData[i])
    }
    this.pageData = finalData.filter((el: any) => {
      return el
    })
  }

  onAction(key: any, id?: any) {
    if (key.toLowerCase() === 'delete') {
      this.onDelete(id);
    } else if (key.toLowerCase() === 'edit' || key.toLowerCase() === 'get') {
      this.qpService.updateParam('id', id);
      const dialogRef = this.dialog.open(this.tableConfig?.popup, {
        panelClass: 'custom-dialog-container',
      });

      dialogRef.afterClosed().subscribe(() => {
        this.qpService.deleteParam('id');
        this.getData();
      });
    }
  }

  getGenre(e: string) {
    if (e.length) {
      this.genre = e;
      let filteredBooks: object[] = [];
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].genre.toLowerCase().replace(' ', '') === e.toLowerCase().replace(' ', '')) {
          filteredBooks.push(this.data[i])
        }
      }
      this.changedData = filteredBooks;
      this.refreshPage();
    }
  }

  ngOnDestroy() {
    this.observables.forEach(obs => {
      obs.unsubscribe();
    })
  }

}
