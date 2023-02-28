import { Injectable } from '@angular/core';
import { PutInMaterialsParams } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.param';
import { GarbageProfilesMaterialRequestService } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.service';
import { GarbageProfilesMediumRequestService } from 'src/app/network/request/garbage-profiles/mediums/garbage-profiles-medium.service';

@Injectable()
export class GarbageProfilesMaterialManagerBusiness {
  constructor(
    private service: GarbageProfilesMaterialRequestService,
    private medium: GarbageProfilesMediumRequestService
  ) {}

  async putin(params: PutInMaterialsParams) {
    if (params.ImageUrls) {
      params.ImageUrls = await this.imageUpload(params.ImageUrls);
    }
    return this.service.putin(params);
  }

  async imageUpload(images: string[]) {
    let all: Promise<string>[] = [];
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      let index = image.indexOf('base64,') + 7;
      let data = image.substring(index);
      all.push(
        this.medium.update(data).then((x) => {
          return x.Id;
        })
      );
    }
    return Promise.all(all);
  }
}
