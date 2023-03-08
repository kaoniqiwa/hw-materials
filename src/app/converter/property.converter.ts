import { Injectable } from '@angular/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { IConverter } from '../common/interfaces/converter.interface';
import { PropertyModel } from '../model/property.model';
import { Property } from '../network/entity/property.entity';
import { GarbageStationProfilesRequestService } from '../network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';

@Injectable({
  providedIn: 'root',
})
export class PropertyConverter
  implements
    IConverter<
      Property | Promise<Property>,
      PropertyModel | Promise<PropertyModel>
    >
{
  constructor(private service: GarbageStationProfilesRequestService) {}

  convert(source: Property): PropertyModel;
  convert(source: Promise<Property>): Promise<PropertyModel>;
  convert(
    source: Property | Promise<Property>
  ): PropertyModel | Promise<PropertyModel> {
    if (source instanceof Property) {
      let plain = instanceToPlain(source);
      let model = plainToInstance(PropertyModel, plain);
      if (source.ParentId) {
        model.Parent = this.service.property.cache
          .get(source.ParentId)
          .then((x) => {
            return this.convert(x);
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
