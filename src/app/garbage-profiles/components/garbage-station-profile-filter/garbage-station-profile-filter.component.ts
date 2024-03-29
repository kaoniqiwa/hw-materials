import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonFlatNode } from 'src/app/common/components/common-tree/common-flat-node.model';
import { DateTimePickerView } from 'src/app/common/directives/date-time-picker/date-time-picker.directive';
import { GarbageStationProfilesLanguageTools } from '../../tools/garbage-station-profile-language.tool';
import { GarbageStationProfilesSourceTools } from '../../tools/garbage-station-profile-source.tool';
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
  @Output()
  ok: EventEmitter<GarbageStationProfileTableArgs> = new EventEmitter();
  @Output()
  cancel: EventEmitter<void> = new EventEmitter();

  constructor(
    public source: GarbageStationProfilesSourceTools,
    public language: GarbageStationProfilesLanguageTools
  ) {}

  DateTimePickerView = DateTimePickerView;

  manager = {
    material: new LabelTreeManager(),
    label: new LabelTreeManager(),
    function: new LabelTreeManager(),
  };

  ngOnInit(): void {
    this.manager.label.select.subscribe((x) => {
      this.args.labels = x;
    });
    this.manager.material.select.subscribe((x) => {
      this.args.materials = x;
    });
    this.manager.function.select.subscribe((x) => {
      this.args.functions = x;
    });
    this.manager.material.ids = this.args.materials.map((x) => x.toString());
    this.manager.label.ids = this.args.labels.map((x) => x.toString());
    this.manager.function.ids = this.args.functions.map((x) => x.toString());
  }

  onStrongCurrentWire() {
    if (this.args.enums['StrongCurrentWire'] === undefined) {
      this.args.enums['StrongCurrentWireMode'] = undefined;
    }
  }

  onok() {
    this.ok.emit(this.args);
  }
  onreset() {
    this.manager.label.nodes = [];
    this.manager.material.nodes = [];
    this.manager.function.nodes = [];
    this.args.duration;
    this.args = new GarbageStationProfileTableArgs();

    this.argsChange.emit(this.args);
  }
  oncancel() {
    this.cancel.emit();
  }
}

class LabelTreeManager {
  select: EventEmitter<number[]> = new EventEmitter();

  nodes: CommonFlatNode[] = [];
  ids: Array<string> = [];
  onselected(nodes: CommonFlatNode[]) {
    this.nodes = nodes;
    let ids = nodes.map((x) => parseInt(x.Id));
    this.select.emit(ids);
  }
  ontoggle(expend: boolean) {
    if (expend === false) {
      this.ids = this.nodes.map((x) => x.Id);
    }
  }
}
