import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModel } from 'src/app/model/material.model';
import { MaterialItem } from 'src/app/network/entity/material-item.enitty';
import { PutInMaterialsParams } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.param';

@Component({
  selector: 'garbage-profiles-material-putin',
  templateUrl: './garbage-profiles-material-putin.component.html',
  styleUrls: ['./garbage-profiles-material-putin.component.less'],
})
export class GarbageProfilesMaterialPutInComponent {
  @Input()
  model?: MaterialModel;
  @Output()
  ok: EventEmitter<PutInMaterialsParams> = new EventEmitter();
  @Output()
  cancel: EventEmitter<void> = new EventEmitter();

  value: number = 0;
  description: string = '';
  image?: string;

  touchSpinChange(num: any) {
    this.value = num;
  }
  onimage(image: string) {
    this.image = image;
  }
  onok() {
    if (this.model) {
      let item = new MaterialItem();
      item.Id = this.model.Id;
      item.Name = this.model.Name;
      item.Number = this.value;
      let params = new PutInMaterialsParams();
      params.MaterialItems = [item];
      params.Description = this.description;
      if (this.image) {
        params.ImageUrls = [this.image];
      }
      this.ok.emit(params);
    }
  }
  oncancel() {
    this.cancel.emit();
  }
}
