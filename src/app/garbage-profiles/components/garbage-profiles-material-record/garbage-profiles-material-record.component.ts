import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonFlatNode } from 'src/app/common/components/common-tree/common-flat-node.model';
import { DateTimePickerView } from 'src/app/common/directives/date-time-picker/date-time-picker.directive';
import { MaterialRecordType } from 'src/app/enum/material-record-type.enum';
import { MaterialRecordModel } from 'src/app/model/material-record.model';
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
  @Output()
  picture: EventEmitter<string[] | undefined> = new EventEmitter();
  @Output()
  details: EventEmitter<MaterialRecordModel> = new EventEmitter();

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
  onTreeNodeSelected(nodes: CommonFlatNode[]) {
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
  onpicture(model: MaterialRecordModel) {
    this.picture.emit(model.ImageUrls);
  }
  ondetails(model: MaterialRecordModel) {
    this.details.emit(model);
  }
}
