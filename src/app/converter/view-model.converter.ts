import { Injectable } from '@angular/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { DivisionModel } from '../model/division.model';
import { GarbageStationProfileModel } from '../model/garbage-station-profile.model';
import { PropertyModel } from '../model/property.model';
import { Division } from '../network/entity/division.entity';
import { GarbageStationProfile } from '../network/entity/garbage-station-profile.entity';
import { Property } from '../network/entity/property.entity';
import { GarbageProfilesBasicRequestService } from '../network/request/garbage-profiles/basics/garbage-profiles-basics.service';
import { GarbageStationProfilesRequestService } from '../network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { Medium } from '../tools/medium';

@Injectable({
  providedIn: 'root',
})
export class ViewModelConverter {
  constructor(
    private basicService: GarbageProfilesBasicRequestService,
    private profileService: GarbageStationProfilesRequestService
  ) {}

  Division(source: Division): DivisionModel;
  Division(source: Promise<Division>): Promise<DivisionModel>;
  Division(
    source: Division | Promise<Division>
  ): DivisionModel | Promise<Division> {
    if (source instanceof Division) {
      let plain = instanceToPlain(source);
      let model = plainToInstance(DivisionModel, plain);
      if (source.ParentId) {
        model.Parent = this.basicService.division.cache
          .get(source.ParentId)
          .then((x) => {
            return this.Division(x);
          });
      }
      return model;
    } else {
      return source.then((x) => {
        return this.Division(x);
      });
    }
  }

  Property(source: Property): PropertyModel;
  Property(source: Promise<Property>): Promise<PropertyModel>;
  Property(
    source: Property | Promise<Property>
  ): PropertyModel | Promise<PropertyModel> {
    if (source instanceof Property) {
      let plain = instanceToPlain(source);
      let model = plainToInstance(PropertyModel, plain);
      if (source.ParentId) {
        model.Parent = this.profileService.property.cache
          .get(source.ParentId)
          .then((x) => {
            return this.Property(x);
          });
      }
      return model;
    } else {
      return source.then((x) => {
        return this.Property(x);
      });
    }
  }

  GarbageStationProfile(
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
      return model;
    } else {
      return source.then((x) => {
        return this.GarbageStationProfile(x);
      });
    }
  }
}
