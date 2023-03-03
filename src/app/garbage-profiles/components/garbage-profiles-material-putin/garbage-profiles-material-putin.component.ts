import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonFlatNode } from 'src/app/common/components/common-tree/common-flat-node.model';
import { MaterialItemModel } from 'src/app/model/material-item.model';
import { MaterialModel } from 'src/app/model/material.model';
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

  description: string = '';
  image?: string;

  materials: MaterialItemModel[] = [];
  selectedIds: string[] = [];
  onTreeNodeSelected(nodes: CommonFlatNode[]) {
    this.materials = nodes
      .filter((x) => {
        return x.RawData instanceof MaterialModel;
      })
      .map((n) => {
        let data = n.RawData as MaterialModel;
        let item = new MaterialItemModel();
        item.Id = data.Id;
        item.Name = data.Name;
        item.Number = 1;
        item.Model = new Promise((x) => {
          x(data);
        });
        return item;
      });
  }

  onremove(item: MaterialItemModel) {
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
