import { Injectable } from '@angular/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { IConverter } from '../common/interfaces/converter.interface';
import { DivisionModel } from '../model/division.model';
import { Division } from '../network/entity/division.entity';

import { GarbageProfilesBasicRequestService } from '../network/request/garbage-profiles/basics/garbage-profiles-basics.service';

@Injectable({
  providedIn: 'root',
})
export class DivisionConverter
  implements
    IConverter<
      Division | Promise<Division>,
      DivisionModel | Promise<DivisionModel>
    >
{
  constructor(private service: GarbageProfilesBasicRequestService) {}

  convert(source: Division): DivisionModel;
  convert(source: Promise<Division>): Promise<DivisionModel>;
  convert(
    source: Division | Promise<Division>
  ): DivisionModel | Promise<DivisionModel> {
    if (source instanceof Division) {
      let plain = instanceToPlain(source);
      let model = plainToInstance(DivisionModel, plain);
      if (source.ParentId) {
        model.Parent = this.service.division.cache
          .get(source.ParentId)
          .then((x) => {
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
