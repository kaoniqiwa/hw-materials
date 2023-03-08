import { Injectable } from '@angular/core';
import { MaterialRecordConverter } from './record-material.converter';
import { ModificationRecordConverter } from './record-modification.converter';

@Injectable({
  providedIn: 'root',
})
export class RecordConverter {
  constructor(
    public material: MaterialRecordConverter,
    public modification: ModificationRecordConverter
  ) {}
}
