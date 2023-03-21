import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonFlatNode } from 'src/app/common/components/common-tree/common-flat-node.model';
import { Property } from 'src/app/network/entity/property.entity';
import { MaintenanceProfilesLanguageTools } from '../../tools/maintenance-profile-language.too';
import { MaintenanceProfileSettingBusiness } from './maintenance-profile-setting.business';

@Component({
  selector: 'maintenance-profile-setting',
  templateUrl: './maintenance-profile-setting.component.html',
  styleUrls: ['./maintenance-profile-setting.component.less'],
  providers: [MaintenanceProfileSettingBusiness],
})
export class MaintenanceProfileSettingComponent implements OnInit {
  @Output()
  ok: EventEmitter<string[]> = new EventEmitter();
  @Output()
  cancel: EventEmitter<void> = new EventEmitter();

  constructor(
    private business: MaintenanceProfileSettingBusiness,
    public language: MaintenanceProfilesLanguageTools
  ) {}

  private _selectedIds: string[] = [];
  get selectedIds(): string[] {
    return this._selectedIds;
  }

  selecteds: Property[] = [];
  names: string[] = [];

  ngOnInit(): void {}
  ontreeloaded() {
    this.business.load().then((x) => {
      this._selectedIds = x;
      this.names = this.selectedIds;
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
    this.names = this.selecteds.map((x) => x.Name);
    let str = JSON.stringify(this.names);
    await this.business.set(str);
    this.ok.emit(this.names);
  }
  oncancel() {
    this.cancel.emit();
  }
  ondrop(event: CdkDragDrop<Property[]>) {
    moveItemInArray(this.selecteds, event.previousIndex, event.currentIndex);
  }
}
