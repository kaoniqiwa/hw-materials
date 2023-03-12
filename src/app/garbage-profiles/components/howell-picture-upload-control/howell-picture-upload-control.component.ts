import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Medium } from 'src/app/common/tools/medium';
import { HowellPictureUploadControlBusiness } from './howell-picture-upload-control.business';

@Component({
  selector: 'howell-picture-upload-control',
  templateUrl: './howell-picture-upload-control.component.html',
  styleUrls: ['./howell-picture-upload-control.component.less'],
  providers: [HowellPictureUploadControlBusiness],
})
export class HowellPictureUploadControlComponent implements OnInit {
  @Output()
  upload: EventEmitter<string> = new EventEmitter();

  @Input()
  image?: string;

  constructor(private business: HowellPictureUploadControlBusiness) {}

  async onimage(image: string) {
    this.image = image;
    let id = await this.business.upload(image);
    this.upload.emit(id);
  }
  ngOnInit() {}
}
