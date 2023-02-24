import { Component, EventEmitter, OnInit } from '@angular/core';
import { CommonFlatNode } from 'src/app/common/components/common-tree/common-flat-node.model';
import { DateTimePickerView } from 'src/app/common/directives/date-time-picker/date-time-picker.directive';
import { MaterialRecordType } from 'src/app/enum/material-record-type.enum';
import { GarbageProfilesRecordMaterialTableArgs } from '../tables/garbage-profiles-record-material-table/garbage-profiles-record-material-table.model';
import { GarbageProfilesMaterialRecordSourceBusiness } from './garbage-profiles-material-record-source.business';
import { GarbageProfilesMaterialRecordBusiness } from './garbage-profiles-material-record.business';
import { GarbageProfilesMaterialRecordSource } from './garbage-profiles-material-record.model';

type SearchPropertyName = 'MaterialName' | 'ProfileName';

@Component({
  selector: 'garbage-profiles-material-record',
  templateUrl: './garbage-profiles-material-record.component.html',
  styleUrls: ['./garbage-profiles-material-record.component.less'],
  providers: [
    GarbageProfilesMaterialRecordSourceBusiness,
    GarbageProfilesMaterialRecordBusiness,
  ],
})
export class GarbageProfilesMaterialRecordComponent implements OnInit {
  constructor(private business: GarbageProfilesMaterialRecordBusiness) {}

  load: EventEmitter<GarbageProfilesRecordMaterialTableArgs> =
    new EventEmitter();

  source: GarbageProfilesMaterialRecordSource =
    new GarbageProfilesMaterialRecordSource();

  args: GarbageProfilesRecordMaterialTableArgs =
    new GarbageProfilesRecordMaterialTableArgs();

  MaterialRecordType = MaterialRecordType;
  DateTimePickerView = DateTimePickerView;

  selectedNodes: CommonFlatNode[] = [];
  defaultIds: string[] = [];
  selectLabelTreeNode(nodes: CommonFlatNode[]) {
    // console.log('外部结果', nodes)
    this.selectedNodes = nodes;
    this.args.materialIds = this.selectedNodes.map((n) => parseInt(n.Id));
  }

  ngOnInit(): void {
    this.business.source.load().then((x) => {
      this.source = x;
    });
  }

  onsearch() {
    this.load.emit(this.args);
  }
}
