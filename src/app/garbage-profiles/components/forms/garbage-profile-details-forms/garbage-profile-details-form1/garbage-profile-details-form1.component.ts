import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, startWith } from 'rxjs';
import { CommonFlatNode } from 'src/app/common/components/common-tree/common-flat-node.model';
import { DateTimePickerView } from 'src/app/common/directives/date-time-picker/date-time-picker.directive';
import { Guid } from 'src/app/common/tools/guid';
import { ValidPhoneExp } from 'src/app/common/tools/tool';
import { FormState } from 'src/app/enum/form-state.enum';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/source.tool';
import { GarbageStationProfileModel } from 'src/app/model/garbage-station-profile.model';
import { Division } from 'src/app/network/entity/division.entity';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { PartialData } from 'src/app/network/entity/partial-data.interface';
import { PartialRequest } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import {
  FormMode,
  _GarbageProfileDetailsFormsBase,
} from '../garbage-profile-details-forms.common';
import { GarbageProfileDetailsForm1Business } from './garbage-profile-details-form1.business';
import {
  DivisionLevel,
  DivisionModel,
  DivisionSearchInfo,
  getDivisionChildLevel,
} from './garbage-profile-details-form1.model';

@Component({
  selector: 'garbage-profile-details-form1',
  templateUrl: './garbage-profile-details-form1.component.html',
  styleUrls: [
    './garbage-profile-details-form1.component.less',
    '../garbage-profile-details.less',
  ],
  providers: [GarbageProfileDetailsForm1Business],
})
export class GarbageProfileDetailsForm1
  extends _GarbageProfileDetailsFormsBase
  implements OnInit
{
  DivisionLevel = DivisionLevel;

  selectedNodes: CommonFlatNode[] = [];
  defaultIds: number[] = [];

  defaultProvince = '上海市';
  defaultCity = '市辖区';
  defaultCounty = '虹口区';
  defaultStreet = '江湾镇街道';
  defaultCommittee = '';

  defaultDivisionSource = new Map([
    [DivisionLevel.None, ''],
    [DivisionLevel.Province, this.defaultProvince],
    [DivisionLevel.City, this.defaultCity],
    [DivisionLevel.County, this.defaultCounty],
    [DivisionLevel.Street, this.defaultStreet],
    [DivisionLevel.Committee, this.defaultCommittee],
  ]);
  divisionSearchInfo: DivisionSearchInfo = {};
  divisionModel: DivisionModel = new DivisionModel();

  override formGroup = new FormGroup({
    ProfileName: new FormControl(null, Validators.required),
    Province: new FormControl(this.defaultProvince, Validators.required),
    City: new FormControl(this.defaultCity, Validators.required),
    County: new FormControl(this.defaultCounty, Validators.required),
    Street: new FormControl(this.defaultStreet, Validators.required),
    Committee: new FormControl(this.defaultCommittee, Validators.required),
    Address: new FormControl(null),
    Contact: new FormControl(null),
    ContactPhoneNo: new FormControl(null, Validators.pattern(ValidPhoneExp)),
    Labels: new FormControl([] as Array<number>),
  });

  get Committee() {
    return this.formGroup.get('Committee') as FormControl;
  }
  filteredOption: Observable<Division[]>;
  constructor(
    source: GarbageStationProfilesSourceTools,
    language: GarbageStationProfilesLanguageTools,
    _toastrService: ToastrService,
    override _business: GarbageProfileDetailsForm1Business,
    private _changeDetector: ChangeDetectorRef
  ) {
    super(_business, _toastrService, source, language);

    this.filteredOption = this.Committee.valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this._filterValue(value);
      })
    );

    // this.formMode = FormMode.ByModel;
  }

  ngOnInit(): void {
    if (this.formMode == FormMode.ByModel) {
      this._initByModel();
    } else {
      this._initByPartial();
    }
  }

  private async _initByModel() {
    await this.initByModel();
    if (this.model) {
      this.defaultIds = this.model.Labels ?? [];
      this._changeDetector.detectChanges();
    }
    await this._updateDivisionModel();

    // 数据加载完成后再触发一次filter
    if (!this.model || !this.model.Committee) {
      this.Committee.setValue('');
    }
  }
  // 有特殊属性 Labels 时
  private async _initByPartial() {
    this.properties = await this.getPropertyByCategory(this.stepIndex + 1);

    let labelProperty = await this._business.getLabelProperty();

    this.properties.push(...labelProperty);

    this.partialData = await this.getPartialData(this.properties);
    console.log('partialData', this.partialData);

    await this.updateFormByPartial();

    if (this.partialData) {
      this.defaultIds = this.partialData['Labels'];

      this._changeDetector.detectChanges();
    }
    await this._updateDivisionPartial();

    if (!this.partialData || !Reflect.get(this.partialData, 'Committee')) {
      this.Committee.setValue('');
    }
  }
  changeDivision(selectEle: HTMLSelectElement, level: DivisionLevel) {
    let selectedOption = selectEle.options[selectEle.selectedIndex];
    let id = selectedOption.id;

    // console.log(`切换区划--level: ${level}--id: ${id}`);
    // 每次切换区划时，下级区划表单内容要清空
    this._resetSelect(level);

    this._getChildDivisionListById(level, id);
  }
  optionSelected(e: MatAutocompleteSelectedEvent) {
    // console.log('option selected', e);
  }
  selectTreeNode(nodes: CommonFlatNode[]) {
    this.selectedNodes = nodes;
    let ids = this.selectedNodes.map((n) => parseInt(n.Id));

    this.formGroup.patchValue({
      Labels: ids,
    });
  }
  private _filterValue(value: string) {
    if (value) {
      let filterValue = value.toLocaleLowerCase();
      return this.divisionModel.Committee.filter((committee) =>
        committee.Name.toLocaleLowerCase().includes(filterValue)
      );
    } else {
      return this.divisionModel.Committee.slice();
    }
  }
  private async _updateDivisionModel() {
    if (this.model) {
      this.defaultDivisionSource.set(
        DivisionLevel.Province,
        this.model.Province
      );
      this.defaultDivisionSource.set(DivisionLevel.City, this.model.City);
      this.defaultDivisionSource.set(DivisionLevel.County, this.model.County);
      this.defaultDivisionSource.set(DivisionLevel.Street, this.model.Street);
      this.defaultDivisionSource.set(
        DivisionLevel.Committee,
        this.model.Committee
      );
    }
    for (let [key, value] of this.defaultDivisionSource.entries()) {
      await this._getChildDivisionListByName(key, value);
      // console.log(key, value, this.divisionModel);
    }
  }

  private async _updateDivisionPartial() {
    if (this.partialData) {
      this.defaultDivisionSource.set(
        DivisionLevel.Province,
        Reflect.get(this.partialData, 'Province')
      );
      this.defaultDivisionSource.set(
        DivisionLevel.City,
        Reflect.get(this.partialData, 'City')
      );
      this.defaultDivisionSource.set(
        DivisionLevel.County,
        Reflect.get(this.partialData, 'County')
      );
      this.defaultDivisionSource.set(
        DivisionLevel.Street,
        Reflect.get(this.partialData, 'Street')
      );
      this.defaultDivisionSource.set(
        DivisionLevel.Committee,
        Reflect.get(this.partialData, 'Committee')
      );
    }
    for (let [key, value] of this.defaultDivisionSource.entries()) {
      await this._getChildDivisionListByName(key, value);
      // console.log(key, value, this.divisionModel);
    }
  }

  private _resetSelect(level: DivisionLevel) {
    let patchValue: { [key: string]: any } = {
      Address: '',
    };

    let childLevel = getDivisionChildLevel(level);

    while (childLevel) {
      patchValue[DivisionLevel[childLevel]] = '';
      this.divisionModel[DivisionLevel[childLevel]] = [];
      childLevel = getDivisionChildLevel(childLevel);
    }

    // console.log('清空下级字段名: ', Object.keys(patchValue));
    this.formGroup.patchValue(patchValue);
  }
  /**
   *
   * @param level 当前层级，需要请求下级信息
   * @param id
   */
  private async _getChildDivisionListById(
    level: DivisionLevel = DivisionLevel.None,
    ParentId?: string
  ) {
    if (level == DivisionLevel.None) {
      this.divisionSearchInfo = {
        ParentIdIsNull: true,
      };
    } else {
      if (!ParentId) return;
      this.divisionSearchInfo = {
        ParentId,
      };
    }
    let childLevel = getDivisionChildLevel(level);

    // level 为 Committee 时，无下级，不需要请求
    if (childLevel) {
      let res = await this._business.getDivisionList(this.divisionSearchInfo);

      // 类属性名和枚举键值关联
      this.divisionModel[DivisionLevel[childLevel] as keyof DivisionModel] =
        res;
    }
  }
  private async _getChildDivisionListByName(
    level: DivisionLevel = DivisionLevel.None,
    name: string = ''
  ) {
    let id = this._business.getDivision(name);
    // console.log(id);
    await this._getChildDivisionListById(level, id);
  }
}
