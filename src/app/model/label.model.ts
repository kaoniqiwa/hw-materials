import { Exclude } from 'class-transformer';
import { Label } from '../network/entity/label.entity';

export class LabelModel extends Label {
  @Exclude()
  StateName: string = '';
  @Exclude()
  CategoryName?: string;
}
