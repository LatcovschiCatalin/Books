import {Injectable} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class CustomFormService {
  service: any;
  customForm: any;
  additionalData: any;
  id: any;
  formData: any;
  onClose: any;
  data: any;

  constructor(private formBuilder: FormBuilder) {
  }

  setGlobalVariables(service: any, customForm: any, additionalData: any, id: any, formData: any, onClose: any, data: any) {
    this.service = service;
    this.customForm = customForm;
    this.additionalData = additionalData;
    this.id = id;
    this.formData = formData;
    this.onClose = onClose;
    this.data = data;
  }

  submit() {
    if (this.customForm.invalid) {
      this.customForm.markAllAsTouched();
      return false;
    } else {
      let data = {
        ...this.customForm.value,
        ...this.additionalData
      }
      if (this.id) {
        console.log(this.id)
        this.service.put(data, this.id).subscribe(() => {
          this.setControls();
          this.closeDialog();
        });

      } else {
        this.service.post(data).subscribe(() => {
          this.setControls();
          this.closeDialog();
        });

      }

      return true;
    }
  }

  setControls() {
    let validators: any[] = [];
    let controls = {};
    let keys = JSON.stringify(this.formData.map((el: any[]) => el.map(e => e.key))).replace(/([.*+?^="!:${}()|\[\]\/\\])/g, '')?.split(',');
    let init = JSON.stringify(this.formData.map((el: any[]) => el.map(e => e.default))).replace(/([.*+?^="!:${}()|\[\]\/\\])/g, '')?.split(',');
    for (let i = 0; i < this.formData.length; i++) {
      for (let j = 0; j < this.formData[i].length; j++) {
        let validate = this.formData[i][j].validators;
        // @ts-ignore
        validators.push(validate ? validate.map(el => el.args ? Validators[el.type](el.args) : Validators[el.type]) : []);
      }
    }
    for (let i = 0; i < keys.length; i++) {
      // @ts-ignore
      controls[keys[i]] = [this.data ? this.data[keys[i]] : init[i], validators[i]];
    }
    return this.formBuilder.group(controls);
  }

  closeDialog() {
    return this.onClose.emit();
  }
}
