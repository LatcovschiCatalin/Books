import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {QueryParamsService} from "../../../services/query-params.service";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {CustomFormService} from "../custom-form/custom-form.service";
import {MatDialog} from "@angular/material/dialog";
import {Books} from "../../../../server/crud/books";

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
  docs = 0;
  page = 1;
  data: any;
  changedData: any;
  show_sort = false;
  searchTerm = '';
  sort = '';
  order = 'ASC'
  observables: Subscription[] = [];
  width = window.innerWidth - 370;
  fieldWidth: any;

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

      if (res['limit']) {
        this.limit_docs = Number(res['limit']);
      } else {
        this.qpService.updateParam('limit', 10);
        this.limit_docs = 10;
      }
    }))
    this.getData();

  }

  showSort(show: boolean) {
    this.show_sort = show;
    if (!this.show_sort) {
      this.qpService.deleteParams({'sort': null, 'order': null});
      this.sort = 'createdAt';
      this.order = 'DES';
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
      this.changedData = this.changedData.filter((el: Books) => {
         return el
      })
    }

  }

  search() {
    this.qpService.updateParam('searchTerm', this.searchTerm);
    this.changedData = this.data.filter((el: any) => {
      let keys = Object.keys(el).filter(key => (
        key !== 'image'
      ))
      let finalRow = {};
      for (let a = 0; a < keys.length; a++) {
        // @ts-ignore
        finalRow[keys[a]] = el[keys[a]]
      }
      return JSON.stringify(finalRow).toLowerCase().includes(this.searchTerm);
    })
    this.docs = this.changedData.length;
    if (!this.show_sort) {
      this.sortData(this.sort)
    }
  }

  getData() {
    this.tableConfig?.service.get().subscribe((data: any) => {
      this.qpService.updateParam('totalItems', data.length);
      this.data = data || [];
      this.docs = this.data.length;
      this.search();
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
      this.qpService.updateParam('limit', this.limit_docs);
    } else if (e.pageIndex + 1 !== this.page) {
      this.page = Number(e.pageIndex) + 1;
      this.qpService.updateParam('page', this.page);
    }
    this.getData();
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


  ngOnDestroy() {
    this.observables.forEach(obs => {
      obs.unsubscribe();
    })
  }
}
