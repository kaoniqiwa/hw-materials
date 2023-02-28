import { Transform } from 'class-transformer';
import { transformDateTime } from './transform.model';

export class PictureResult {
  Id!: string;
  Url?: string;
  @Transform(transformDateTime)
  CreateTime!: Date;
}
