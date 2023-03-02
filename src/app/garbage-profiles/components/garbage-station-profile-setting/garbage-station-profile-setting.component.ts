import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonFlatNode } from 'src/app/common/components/common-tree/common-flat-node.model';
import { Property } from 'src/app/network/entity/property.entity';
import { GarbageStationProfileSettingBusiness } from './garbage-station-profile-setting.business';

@Component({
  selector: 'garbage-station-profile-setting',
  templateUrl: './garbage-station-profile-setting.component.html',
  styleUrls: ['./garbage-station-profile-setting.component.less'],
  providers: [GarbageStationProfileSettingBusiness],
})
export class GarbageStationProfileSettingComponent implements OnInit {
  @Output()
  ok: EventEmitter<string[]> = new EventEmitter();
  @Output()
  cancel: EventEmitter<void> = new EventEmitter();

  constructor(private business: GarbageStationProfileSettingBusiness) {}

  private _selectedIds: string[] = [];
  get selectedIds(): string[] {
    return this._selectedIds;
  }

  selecteds: Property[] = [];

  ngOnInit(): void {}
  ontreeloaded() {
    this.business.load().then((x) => {
      this._selectedIds = x;
    });
  }
  onselect(nodes: CommonFlatNode[]) {
    this.selecteds = nodes
      .filter((x) => x.RawData instanceof Property)
      .map((x) => {
        return x.RawData;
      });
  }

  async onok() {
    let ids = this.selecteds.map((x) => x.Id);
    let str = JSON.stringify(ids);
    await this.business.set(str);
    this.ok.emit(ids);
  }
  oncancel() {
    this.cancel.emit();
  }
}
