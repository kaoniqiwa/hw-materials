import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonFlatNode } from 'src/app/common/components/common-tree/common-flat-node.model';
import { MaterialItemModel } from 'src/app/model/material-item.model';
import { MaterialModel } from 'src/app/model/material.model';
import { MaterialItem } from 'src/app/network/entity/material-item.enitty';
import { PutOutMaterialsParams } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.param';
import { GarbageProfilesMaterialPutoutBusiness } from './garbage-profiles-material-putout.business';
import {
  MaterialQuantitys,
  TreeModel,
} from './garbage-profiles-material-putout.model';

@Component({
  selector: 'garbage-profiles-material-putout',
  templateUrl: './garbage-profiles-material-putout.component.html',
  styleUrls: ['./garbage-profiles-material-putout.component.less'],
  providers: [GarbageProfilesMaterialPutoutBusiness],
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
  @Input()
  profileId?: string;

  constructor(private business: GarbageProfilesMaterialPutoutBusiness) {}
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
    this.loadData();
  }
  description: string = '';
  image?: string;

  quantitys = new MaterialQuantitys();
  materials: MaterialItemModel[] = [];
  selectedIds: string[] = [];
  tree1 = {
    profile: new TreeModel(),
  };

  loadData() {
    this.business.materials.load().then((material) => {
      this.quantitys = {};
      material.forEach((x) => {
        this.quantitys[x.Id] = x.Quantity;
      });
    });
  }

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
    params.ProfileId = this.profileId || this.tree1.profile.id;

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
