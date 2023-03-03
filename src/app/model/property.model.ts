import { Exclude } from 'class-transformer';
import { Property } from '../network/entity/property.entity';

export class PropertyModel extends Property {
  @Exclude()
  Parent?: Promise<PropertyModel>;
}
