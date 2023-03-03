import { Exclude } from 'class-transformer';
import { Division } from '../network/entity/division.entity';

export class DivisionModel extends Division {
  @Exclude()
  Parent?: Promise<DivisionModel>;
}
