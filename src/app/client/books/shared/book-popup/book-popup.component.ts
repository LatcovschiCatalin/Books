import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {CrudService} from "../../../../server/crud/crud.service";
import {validationMessages} from "../../../constants";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-book-popup',
  templateUrl: './book-popup.component.html',
  styleUrls: ['./book-popup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BookPopupComponent implements OnInit {
  mode = 'dark';
  validators = {
    required: {
      type: 'required',
      message: validationMessages.requiredField,
    },
  }
  request = {
    labels: [
      [
        {
          title: 'Title',
          key: 'title',
          type: 'text',
          default: '',
          validators: [
            this.validators.required
          ]
        },
      ],
      [
        {
          title: 'Author',
          key: 'author',
          type: 'text',
          default: '',
          validators: [
            this.validators.required
          ]
        },
      ],
      [
        {
          title: 'Genre',
          key: 'genre',
          type: 'text',
          default: '',
          validators: [
            this.validators.required
          ]
        },
      ],
      [
        {
          title: 'Upload image here!',
          key: 'image',
          type: 'image',
          default: '',
          validators: [
            this.validators.required
          ]
        },
      ],
    ],
  };

  constructor(
    public service: CrudService,
    private cookieService: CookieService,
    public dialogRef: MatDialogRef<BookPopupComponent>
  ) {
    this.mode = this.cookieService.get('mode') || 'dark';
  }


  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }
}


