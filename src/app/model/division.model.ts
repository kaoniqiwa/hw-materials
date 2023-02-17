import { Division } from '../network/entity/division.entity';

export class DivisionModel extends Division {
  Parent?: Promise<DivisionModel>;
}
