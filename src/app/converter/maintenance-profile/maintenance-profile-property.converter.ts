import { Injectable } from '@angular/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';
import { IConverter } from '../../common/interfaces/converter.interface';
import { PropertyModel } from '../../model/property.model';
import { Property } from '../../network/entity/property.entity';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceProfilePropertyConverter
  implements
    IConverter<
      Property | Promise<Property>,
      PropertyModel | Promise<PropertyModel>
    >
{
  constructor(private service: MaintenanceProfileRequestService) {}

  convert(source: Property): PropertyModel;
  convert(source: Promise<Property>): Promise<PropertyModel>;
  convert(
    source: Property | Promise<Property>
  ): PropertyModel | Promise<PropertyModel> {
    if (source instanceof Property) {
      let plain = instanceToPlain(source);
      let model = plainToInstance(PropertyModel, plain);
      if (source.ParentId) {
        model.Parent = this.service.property.get(source.ParentId).then((x) => {
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
