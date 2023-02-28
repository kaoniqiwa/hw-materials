import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PictureResult } from 'src/app/network/entity/picture-result.entity';
import { PicturesUrl } from 'src/app/network/url/garbage_profiles/garbage_profiles_pictures.url';
import { HowellAuthHttpService } from '../../howell-auth-http.service';

@Injectable({
  providedIn: 'root',
})
export class GarbageProfilesMediumRequestService {
  constructor(private http: HowellAuthHttpService) {}

  update(image: string): Promise<PictureResult> {
    let url = PicturesUrl.upload();

    let observable = this.http.postImage<{ Data: PictureResult }>(
      url,
      `"${image}"`
    );
    let promise = firstValueFrom(observable);

    return promise.then((x) => {
      return x.Data;
    });
  }
}
