import { Component, Input } from '@angular/core';

@Component({
  selector: 'picture-upload',
  templateUrl: './picture-upload.component.html',
  styleUrls: ['./picture-upload.component.less'],
})
export class PictureUploadComponent {
  @Input() id: string = '';

  @Input()
  accept: string = '*.png|*.jpg|*.jpeg|*.bmp';

  imageUrl: string = '';

  onupload() {}

  change(fileInput: HTMLInputElement) {}
}
