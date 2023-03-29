import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonFlatNode } from 'src/app/common/components/common-tree/common-flat-node.model';
import { MaterialItemModel } from 'src/app/model/material-item.model';
import { MaterialModel } from 'src/app/model/material.model';
import { MaterialItem } from 'src/app/network/entity/material-item.enitty';
import { PutOutMaterialsParams } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.param';

@Component({
  selector: 'garbage-profiles-material-putout',
  templateUrl: './garbage-profiles-material-putout.component.html',
  styleUrls: ['./garbage-profiles-material-putout.component.less'],
})
export class GarbageProfilesMaterialPutoutComponent implements OnInit {
  @Output()
  ok: EventEmitter<PutOutMaterialsParams> = new EventEmitter();
  @Input()
  onlyMaterials = false;
  @Input()
  items?: MaterialItem[];
  @Output()
  cancel: EventEmitter<void> = new EventEmitter();
  ngOnInit(): void {
    if (this.items) {
      this.selectedIds = this.items.map((x) => x.Id.toString());
      this.materials = this.items.map((x) => {
        let model = new MaterialItemModel();
        model.Id = x.Id;
        model.Name = x.Name;
        model.Number = x.Number;
        return model;
      });
    }
  }
  description: string = '';
  image?: string;
  max = Number.MAX_VALUE;
  materials: MaterialItemModel[] = [];
  selectedIds: string[] = [];
  onTreeNodeSelected(nodes: CommonFlatNode[]) {
    this.materials = nodes
      .filter((x) => {
        return x.RawData instanceof MaterialModel;
      })
      .map((n) => {
        let data = n.RawData as MaterialModel;
        let item = this.materials.find((x) => x.Id.toString() === n.Id);

        if (!item) {
          item = new MaterialItemModel();
          item.Id = data.Id;
          item.Name = data.Name;
          item.Number = 1;
          item.Model = new Promise((x) => {
            x(data);
          });
        } else if (!item.Model) {
          item.Model = new Promise((x) => {
            x(data);
          });
        }
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
    let params = new PutOutMaterialsParams();
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
