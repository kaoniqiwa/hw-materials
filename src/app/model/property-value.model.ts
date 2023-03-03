import { PropertyValue } from '../network/entity/property-value.entity';
import { PropertyModel } from './property.model';

export class PropertyValueModel extends PropertyValue {
  Property?: Promise<PropertyModel>;
}
