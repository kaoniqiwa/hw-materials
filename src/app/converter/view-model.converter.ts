import { Injectable } from '@angular/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { DivisionModel } from '../model/division.model';
import { Division } from '../network/entity/division.entity';
import { GarbageProfilesBasicRequestService } from '../network/request/garbage-profiles/basics/garbage-profiles-basics.service';

@Injectable({
  providedIn: 'root',
})
export class ViewModelConverter {
  constructor(private basicService: GarbageProfilesBasicRequestService) {}

  Division(source: Division): DivisionModel;
  Division(source: Promise<Division>): Promise<DivisionModel>;

  Division(
    source: Division | Promise<Division>,
    ...res: any[]
  ): DivisionModel | Promise<Division> {
    if (source instanceof Division) {
      let plain = instanceToPlain(source);
      let model = plainToInstance(DivisionModel, plain);
      if (source.ParentId) {
        model.Parent = this.basicService.division.cache
          .get(source.ParentId)
          .then((x) => {
            return this.Division(x);
          });
      }
      return model;
    } else {
      return source.then((x) => {
        return this.Division(x);
      });
    }
  }
}
