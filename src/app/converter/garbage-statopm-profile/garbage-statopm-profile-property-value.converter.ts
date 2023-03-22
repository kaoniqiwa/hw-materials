import { Injectable } from '@angular/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { IConverter } from '../../common/interfaces/converter.interface';
import { PropertyValueModel } from '../../model/property-value.model';
import { PropertyValue } from '../../network/entity/property-value.entity';
import { GarbageStationProfilesRequestService } from '../../network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { GarbageStationProfilePropertyConverter } from './garbage-statopm-profile-property.converter';

@Injectable({
  providedIn: 'root',
})
export class GarbageStationProfilePropertyValueConverter
  implements
    IConverter<
      PropertyValue | Promise<PropertyValue>,
      PropertyValueModel | Promise<PropertyValueModel>
    >
{
  constructor(
    private service: GarbageStationProfilesRequestService,
    private property: GarbageStationProfilePropertyConverter
  ) {}

  convert(source: PropertyValue): PropertyValueModel;
  convert(source: Promise<PropertyValue>): Promise<PropertyValueModel>;
  convert(
    source: PropertyValue | Promise<PropertyValue>
  ): PropertyValueModel | Promise<PropertyValueModel> {
    if (source instanceof PropertyValue) {
      let plain = instanceToPlain(source);
      let model = plainToInstance(PropertyValueModel, plain);

      if (source.PropertyId) {
        model.Property = this.service.property
          .get(source.PropertyId)
          .then((x) => {
            return this.property.convert(x);
          });
      }
      return model;
    } else {
      return source.then((x) => {
        return this.convert(x);
      });
    }
  }
}
