import { Injectable } from '@angular/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';
import { IConverter } from '../../common/interfaces/converter.interface';
import { PropertyValueModel } from '../../model/property-value.model';
import { PropertyValue } from '../../network/entity/property-value.entity';
import { MaintenanceProfilePropertyConverter } from './maintenance-profile-property.converter';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceProfilePropertyValueConverter
  implements
    IConverter<
      PropertyValue | Promise<PropertyValue>,
      PropertyValueModel | Promise<PropertyValueModel>
    >
{
  constructor(
    private service: MaintenanceProfileRequestService,
    private property: MaintenanceProfilePropertyConverter
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
