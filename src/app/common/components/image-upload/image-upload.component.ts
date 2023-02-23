import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.less'],
})
export class ImageUploadComponent implements OnInit {
  @Input()
  image?: string;
  @Input()
  accept: string = '*.png|*.jpg|*.jpeg|*.bmp';

  @Output()
  upload: EventEmitter<string> = new EventEmitter();

  constructor() {}
  @ViewChild('file')
  file?: ElementRef;
  ngOnInit(): void {}
  onupload() {
    if (this.file) {
      this.file.nativeElement.click();
    }
  }
  fileChange() {
    if (this.file) {
      const t_files = this.file.nativeElement.files;
      if (t_files.length > 0) {
        this.uploadFile(t_files[0]);
        this.file.nativeElement.value = null;
      }
    }
  }
  async uploadFile(file: any) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('loadend', () => {
      let str = reader.result as string;

      this.image = str;
      this.upload.emit(this.image);
    });
  }
}
