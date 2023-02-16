import { ClassConstructor } from 'class-transformer';
import { IObjectModel } from 'src/app/interface/model.interface';

export class Model implements IObjectModel {
  Id!: string;
  Name!: string;

  equals<T extends Model>(value?: Model, type?: ClassConstructor<T>) {
    if (!value) return false;
    if (type) {
      if (type.name !== value.constructor.name) {
        return false;
      }
    }

    return this.Id === value.Id;
  }
}
