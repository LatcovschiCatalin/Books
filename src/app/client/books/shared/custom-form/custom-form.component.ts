import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {CustomFormService} from "./custom-form.service";
import {Subscription} from "rxjs";
import {Books} from "../../../../server/crud/books";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-custom-form',
  templateUrl: './custom-form.component.html',
  styleUrls: ['./custom-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomFormComponent implements OnInit, OnDestroy {
  @Output() onClose = new EventEmitter;
  @Output() fileName = new EventEmitter;
  @Input() formConfig: any;

  // @ts-ignore
  customForm: FormGroup;
  show = true;
  id: any;
  data: any;
  response: any;
  selectedFile: any;
  observables: Subscription[] = [];
  mode = 'dark';

  constructor(private route: ActivatedRoute, public customFormService: CustomFormService, private cookieService: CookieService) {
    this.mode = this.cookieService.get('mode') || 'dark';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((p: any) => {
      if (p.id) {
        this.id = p.id;
        this.formConfig?.service.getById(p.id).subscribe((data: Books) => {
          this.data = data;
          this.setData();
        })
      }
    });
    this.setData();
  }

  setControls() {
    this.globalVariables();
    this.customForm = this.customFormService.setControls()
  }

  setData() {
    this.globalVariables();
    this.setControls();
  }

  globalVariables() {
    this.customFormService.setGlobalVariables(this.formConfig?.service, this.customForm, this.formConfig?.additionalData, this.id, this.formConfig?.formData, this.onClose, this.data);
  }

  upload(fieldName: any, e: any) {
    this.show = true;
    this.selectedFile = e?.selectedFile;
    this.customForm?.controls[fieldName].setValue(e?.url);
  }

  onSubmit() {
    this.globalVariables();
    this.show = this.customFormService.submit();
    if (this.show) {
      this.customForm = this.customFormService.setControls()
      this.globalVariables();
      this.show = false;
    }
  }

  ngOnDestroy() {
    this.observables.forEach(obs => {
      obs.unsubscribe();
    })
  }
}
