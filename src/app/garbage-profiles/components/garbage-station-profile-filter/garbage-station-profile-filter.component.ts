import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonFlatNode } from 'src/app/common/components/common-tree/common-flat-node.model';
import { DateTimePickerView } from 'src/app/common/directives/date-time-picker/date-time-picker.directive';
import { GarbageStationProfilesLanguageTools } from '../../tools/language.tool';
import { GarbageStationProfilesSourceTools } from '../../tools/source.tool';
import { GarbageStationProfileTableArgs } from '../tables/garbage-station-profile-table/garbage-station-profile-table.model';

@Component({
  selector: 'garbage-station-profile-filter',
  templateUrl: './garbage-station-profile-filter.component.html',
  styleUrls: ['./garbage-station-profile-filter.component.less'],
})
export class GarbageStationProfileFilterComponent implements OnInit {
  @Input()
  args: GarbageStationProfileTableArgs = new GarbageStationProfileTableArgs();
  @Output()
  argsChange: EventEmitter<GarbageStationProfileTableArgs> = new EventEmitter();

  constructor(
    public source: GarbageStationProfilesSourceTools,
    public language: GarbageStationProfilesLanguageTools
  ) {}

  DateTimePickerView = DateTimePickerView;

  manager = {
    material: new TreeManager(),
    label: new TreeManager(),
  };

  ngOnInit(): void {
    this.manager.label.select.subscribe((x) => {
      this.args.labels = x;
    });
    this.manager.material.select.subscribe((x) => {});
  }

  onStrongCurrentWire() {
    if (this.args.StrongCurrentWire === undefined) {
      this.args.StrongCurrentWireMode = undefined;
    }
  }
}

class TreeManager {
  select: EventEmitter<number[]> = new EventEmitter();

  nodes: CommonFlatNode[] = [];
  onselected(nodes: CommonFlatNode[]) {
    this.nodes = nodes;
    let ids = nodes.map((x) => parseInt(x.Id));
    this.select.emit(ids);
  }
}
