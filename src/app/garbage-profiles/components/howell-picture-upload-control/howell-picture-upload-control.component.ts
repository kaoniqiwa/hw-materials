import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Medium } from 'src/app/common/tools/medium';
import { HowellPictureUploadControlBusiness } from './howell-picture-upload-control.business';

@Component({
  selector: 'howell-picture-upload-control',
  templateUrl: './howell-picture-upload-control.component.html',
  styleUrls: ['./howell-picture-upload-control.component.less'],
  providers: [HowellPictureUploadControlBusiness],
})
export class HowellPictureUploadControlComponent {
  @Output()
  upload: EventEmitter<string> = new EventEmitter();

  image?: string;

  @Input() id?: string;
  constructor(private business: HowellPictureUploadControlBusiness) {}

  async onimage(image: string) {
    this.image = image;
    let id = await this.business.upload(image);
    this.upload.emit(id);
  }
  ngOnInit() {
    if (this.id) {
      console.log(Medium.jpg(this.id));

      this.image = Medium.jpg(this.id);
    }
  }
}
