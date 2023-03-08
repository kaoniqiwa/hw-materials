import { Injectable } from '@angular/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { IConverter } from '../common/interfaces/converter.interface';
import { Medium } from '../common/tools/medium';
import { GarbageStationProfileModel } from '../model/garbage-station-profile.model';
import { GarbageStationProfile } from '../network/entity/garbage-station-profile.entity';

import { GarbageStationProfilesRequestService } from '../network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';

@Injectable({
  providedIn: 'root',
})
export class GarbageStationProfileConverter
  implements
    IConverter<
      GarbageStationProfile | Promise<GarbageStationProfileModel>,
      GarbageStationProfile | Promise<GarbageStationProfileModel>
    >
{
  constructor(private service: GarbageStationProfilesRequestService) {}

  convert(source: GarbageStationProfile): GarbageStationProfileModel;
  convert(
    source: Promise<GarbageStationProfile>
  ): Promise<GarbageStationProfileModel>;
  convert(
    source: GarbageStationProfile | Promise<GarbageStationProfile>
  ): GarbageStationProfileModel | Promise<GarbageStationProfileModel> {
    if (source instanceof GarbageStationProfile) {
      let plain = instanceToPlain(source);
      let model = plainToInstance(GarbageStationProfileModel, plain);
      if (source.LFImageUrl) {
        model.LFImage = Medium.img(source.LFImageUrl);
      }
      if (source.RFImageUrl) {
        model.RFImage = Medium.img(source.RFImageUrl);
      }
      if (source.FImageUrl) {
        model.FImage = Medium.img(source.LFImageUrl);
      }
      if (source.PowerImageUrl) {
        model.PowerImage = Medium.img(source.LFImageUrl);
      }
      model.ProfileStateName = this.service.property
        .getEnumByName('ProfileState')
        .then((array) => {
          return array.find((x) => x.Value === source.ProfileState)!.Name;
        });

      return model;
    } else {
      return source.then((x) => {
        return this.convert(x);
      });
    }
  }
}
