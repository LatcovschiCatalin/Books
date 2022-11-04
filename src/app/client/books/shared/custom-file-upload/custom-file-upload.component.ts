import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs";

class fileSnippet {
  constructor(public src: string, public file: File) {
  }
}

@Component({
  selector: 'app-custom-file-upload',
  templateUrl: './custom-file-upload.component.html',
  styleUrls: ['./custom-file-upload.component.scss']
})
export class CustomFileUploadComponent implements OnInit, OnDestroy {
  @Output() getFile = new EventEmitter<any>();
  @Input() uploadConfig: any;
  selectedFile: fileSnippet | undefined;
  fileUrl: any;
  observables: Subscription[] = [];

  constructor() {
  }


  ngOnInit() {
  }

  processFile(fileInput: any) {
    const file: File = fileInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new fileSnippet(event.target.result, file);
      this.fileUrl = this.selectedFile.src;
      this.getFile.emit({url: this.fileUrl});
    });
    reader.readAsDataURL(file)
  }


  deleteFile() {
    this.fileUrl = '';
    this.uploadConfig.url = '';
    this.getFile.emit({url: ''})
  }


  ngOnDestroy() {
    this.observables.forEach(obs => {
      obs.unsubscribe();
    })
  }
}
