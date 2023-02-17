import { Property } from '../network/entity/property.entity';

export class PropertyModel extends Property {
  Parent?: Promise<PropertyModel>;
}
