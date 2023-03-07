import { Injectable } from '@angular/core';
import { GarbageProfilesMediumRequestService } from 'src/app/network/request/garbage-profiles/mediums/garbage-profiles-medium.service';

@Injectable()
export class HowellPictureUploadControlBusiness {
  constructor(private service: GarbageProfilesMediumRequestService) {}
  async upload(image: string) {
    let index = image.indexOf('base64,') + 7;
    let data = image.substring(index);
    return this.service.update(data).then((x) => {
      return x.Id;
    });
  }
}
