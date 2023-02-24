import { Injectable } from '@angular/core';
import { GarbageProfilesMaterialRecordSourceBusiness } from './garbage-profiles-material-record-source.business';

@Injectable()
export class GarbageProfilesMaterialRecordBusiness {
  constructor(public source: GarbageProfilesMaterialRecordSourceBusiness) {}
}
