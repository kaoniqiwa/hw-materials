import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonFlatNode } from 'src/app/common/components/common-tree/common-flat-node.model';
import { MaterialModel } from 'src/app/model/material.model';
import { MaterialItem } from 'src/app/network/entity/material-item.enitty';
import { Material } from 'src/app/network/entity/material.entity';
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

  materials: MaterialItem[] = [];
  selectedIds: string[] = [];
  onTreeNodeSelected(nodes: CommonFlatNode[]) {
    this.materials = nodes.map((n) => {
      let data = n.RawData as Material;
      let item = new MaterialItem();
      item.Id = data.Id;
      item.Name = data.Name;
      item.Number = 0;
      return item;
    });
  }

  touchSpinChange(num: any) {
    this.value = num;
  }
  onremove(item: MaterialItem) {
    let index = this.materials.findIndex((x) => x.Id === item.Id);
    if (index < 0) return;
    this.materials.splice(index, 1);
    this.selectedIds = this.materials.map((x) => x.Id.toString());
  }
  onimage(image: string) {
    this.image = image;
  }
  onok() {
    let params = new PutInMaterialsParams();
    params.MaterialItems = this.materials;
    params.Description = this.description;
    if (this.image) {
      params.ImageUrls = [this.image];
    }
    this.ok.emit(params);
  }
  oncancel() {
    this.cancel.emit();
  }
}
