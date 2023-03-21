import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonFlatNode } from 'src/app/common/components/common-tree/common-flat-node.model';
import { DateTimePickerView } from 'src/app/common/directives/date-time-picker/date-time-picker.directive';
import { MaintenanceProfilesLanguageTools } from '../../tools/maintenance-profile-language.too';

import { MaintenanceProfilesSourceTools } from '../../tools/maintenance-profile-source.tool';
import { MaintenanceProfileTableArgs } from '../tables/maintenance-profile-table/maintenance-profile-table.model';

@Component({
  selector: 'maintenance-profile-filter',
  templateUrl: './maintenance-profile-filter.component.html',
  styleUrls: ['./maintenance-profile-filter.component.less'],
})
export class MaintenanceProfileFilterComponent implements OnInit {
  @Input()
  args: MaintenanceProfileTableArgs = new MaintenanceProfileTableArgs();
  @Output()
  argsChange: EventEmitter<MaintenanceProfileTableArgs> = new EventEmitter();
  @Output()
  ok: EventEmitter<MaintenanceProfileTableArgs> = new EventEmitter();
  @Output()
  cancel: EventEmitter<void> = new EventEmitter();

  constructor(
    public source: MaintenanceProfilesSourceTools,
    public language: MaintenanceProfilesLanguageTools
  ) {}

  DateTimePickerView = DateTimePickerView;

  manager = {
    material: new LabelTreeManager(),
    label: new LabelTreeManager(),
    function: new LabelTreeManager(),
  };

  ngOnInit(): void {
    this.manager.material.select.subscribe((x) => {
      this.args.materials = x;
    });
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
    this.args = new MaintenanceProfileTableArgs();

    this.argsChange.emit(this.args);
  }
  oncancel() {
    this.cancel.emit();
  }
}

class LabelTreeManager {
  select: EventEmitter<number[]> = new EventEmitter();

  nodes: CommonFlatNode[] = [];
  ids: string[] = [];
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
