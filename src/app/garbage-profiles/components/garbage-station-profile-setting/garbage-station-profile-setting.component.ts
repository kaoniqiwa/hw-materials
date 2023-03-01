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

  selectedIds: string[] = [];

  ngOnInit(): void {
    // this.business.load().then((x) => {
    //   this.selectedIds = x;
    // });
  }

  onselect(nodes: CommonFlatNode[]) {
    this.selectedIds = nodes
      .filter((x) => x.RawData instanceof Property)
      .map((x) => {
        let property = x.RawData as Property;
        return property.Id.toString();
      });
  }

  onok() {
    let str = JSON.stringify(this.selectedIds);
    this.business.set(str);
  }
  oncancel() {
    this.cancel.emit();
  }
}
