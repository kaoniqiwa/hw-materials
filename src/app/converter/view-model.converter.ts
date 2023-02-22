import { Injectable } from '@angular/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Medium } from '../common/tools/medium';
import { DivisionModel } from '../model/division.model';
import { GarbageStationProfileModel } from '../model/garbage-station-profile.model';
import { MaterialRecordModel } from '../model/material-record.model';
import { MaterialModel } from '../model/material.model';
import { ModificationRecordModel } from '../model/modification-record.model';
import { PropertyModel } from '../model/property.model';
import { Division } from '../network/entity/division.entity';
import { GarbageStationProfile } from '../network/entity/garbage-station-profile.entity';
import { MaterialRecord } from '../network/entity/material-record.entity';
import { Material } from '../network/entity/material.entity';
import { ModificationRecord } from '../network/entity/modification-record.entity';
import { Property } from '../network/entity/property.entity';
import { GarbageProfilesBasicRequestService } from '../network/request/garbage-profiles/basics/garbage-profiles-basics.service';
import { GarbageStationProfilesRequestService } from '../network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { GarbageProfilesMaterialRequestService } from '../network/request/garbage-profiles/materials/garbage-profiles-materials.service';
import { GarbageProfilesRecordRequestService } from '../network/request/garbage-profiles/records/garbage-profiles-records.service';

@Injectable({
  providedIn: 'root',
})
export class ViewModelConverter {
  constructor(
    private basicService: GarbageProfilesBasicRequestService,
    private profileService: GarbageStationProfilesRequestService,
    private materialService: GarbageProfilesMaterialRequestService,
    private recordService: GarbageProfilesRecordRequestService
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
    source: GarbageStationProfile
  ): GarbageStationProfileModel;
  GarbageStationProfile(
    source: Promise<GarbageStationProfile>
  ): Promise<GarbageStationProfileModel>;
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

  Material(source: Material): MaterialModel;
  Material(source: Promise<Material>): Promise<MaterialModel>;
  Material(
    source: Material | Promise<Material>
  ): MaterialModel | Promise<MaterialModel> {
    if (source instanceof Material) {
      let plain = instanceToPlain(source);
      let model = plainToInstance(MaterialModel, plain);

      model.CategoryInfo = this.materialService.category.get(source.Category);

      return model;
    } else {
      return source.then((x) => {
        return this.Material(x);
      });
    }
  }

  MaterialRecord(source: MaterialRecord): MaterialRecordModel;
  MaterialRecord(source: Promise<MaterialRecord>): Promise<MaterialRecordModel>;
  MaterialRecord(
    source: MaterialRecord | Promise<MaterialRecord>
  ): MaterialRecordModel | Promise<MaterialRecordModel> {
    if (source instanceof MaterialRecord) {
      let plain = instanceToPlain(source);
      let model = plainToInstance(MaterialRecordModel, plain);

      if (source.ProfileId) {
        model.Profile = this.profileService.get(source.ProfileId).then((x) => {
          return this.GarbageStationProfile(x);
        });
      }
      if (source.ImageUrls) {
        let all = source.ImageUrls.map((x) => {
          return new Promise<string>((resolve) => {
            resolve(Medium.jpg(x));
          });
        });
        model.Images = Promise.all(all);
      }
      return model;
    } else {
      return source.then((x) => {
        return this.MaterialRecord(x);
      });
    }
  }

  ModificationRecord(source: ModificationRecord): ModificationRecordModel;
  ModificationRecord(
    source: Promise<ModificationRecord>
  ): Promise<ModificationRecordModel>;
  ModificationRecord(
    source: ModificationRecord | Promise<ModificationRecord>
  ): ModificationRecordModel | Promise<ModificationRecordModel> {
    if (source instanceof ModificationRecord) {
      let plain = instanceToPlain(source);
      let model = plainToInstance(ModificationRecordModel, plain);

      if (source.ProfileId) {
        model.Profile = this.profileService.cache
          .get(source.ProfileId)
          .then((x) => {
            return this.GarbageStationProfile(x);
          });
      }
      source.ProfileType;
      return model;
    } else {
      return source.then((x) => {
        return this.ModificationRecord(x);
      });
    }
  }
}
