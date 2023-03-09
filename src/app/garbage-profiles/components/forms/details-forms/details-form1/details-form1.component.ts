import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonFlatNode } from 'src/app/common/components/common-tree/common-flat-node.model';
import { DateTimePickerView } from 'src/app/common/directives/date-time-picker/date-time-picker.directive';
import { Guid } from 'src/app/common/tools/guid';
import { ValidPhoneExp } from 'src/app/common/tools/tool';
import { FormState } from 'src/app/enum/form-state.enum';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/source.tool';
import { GarbageStationProfileModel } from 'src/app/model/garbage-station-profile.model';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { DetailsForm1Business } from './details-form1.business';
import {
  DivisionLevel,
  DivisionModel,
  DivisionSearchInfo,
  getDivisionChildLevel,
} from './details-form1.model';

@Component({
  selector: 'details-form1',
  templateUrl: './details-form1.component.html',
  styleUrls: ['./details-form1.component.less'],
  providers: [DetailsForm1Business],
})
export class DetailsForm1Component implements OnInit {
  FormState = FormState;
  DivisionLevel = DivisionLevel;

  @Input()
  formId?: string;

  @Input()
  state: FormState = FormState.none;

  @Output() close = new EventEmitter();

  @Output() next = new EventEmitter();

  private _model: GarbageStationProfile | null = null;

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

  formGroup = new FormGroup({
    ProfileName: new FormControl('', Validators.required),
    Province: new FormControl(this.defaultProvince, Validators.required),
    City: new FormControl(this.defaultCity, Validators.required),
    County: new FormControl(this.defaultCounty, Validators.required),
    Street: new FormControl(this.defaultStreet, Validators.required),
    Committee: new FormControl(this.defaultCommittee, Validators.required),
    Address: new FormControl(''),
    Contact: new FormControl(''),
    ContactPhoneNo: new FormControl('', Validators.pattern(ValidPhoneExp)),
    Labels: new FormControl([] as Array<number>),
  });
  constructor(
    public source: GarbageStationProfilesSourceTools,
    public language: GarbageStationProfilesLanguageTools,
    private _business: DetailsForm1Business,
    private _toastrService: ToastrService
  ) {}
  ngOnInit(): void {
    this._init();
  }
  changeDivision(selectEle: HTMLSelectElement, level: DivisionLevel) {
    let selectedOption = selectEle.options[selectEle.selectedIndex];
    let id = selectedOption.id;

    console.log(`切换区划--level: ${level}--id: ${id}`);
    // 每次切换区划时，下级区划表单内容要清空
    this._resetSelect(level);

    this._getChildDivisionListById(level, id);
  }
  onTreeNodeSelected(nodes: CommonFlatNode[]) {
    this.selectedNodes = nodes;
    let ids = this.selectedNodes.map((n) => parseInt(n.Id));

    this.formGroup.patchValue({
      Labels: ids,
    });
  }
  async clickCreate() {
    let res = await this._createOrUpdateModel();
    if (res) {
      this._toastrService.success('创建成功');
      this.close.emit();
    }
  }

  async clickNext() {
    let res: GarbageStationProfile | null;
    res = await this._createOrUpdateModel();
    if (res) {
      this._toastrService.success('操作成功');
      this.next.emit();
    }
  }
  private async _init() {
    if (this.formId) {
      this._model = await this._business.getModel(this.formId);
      console.log(this._model);
      this.defaultIds = this._model.Labels ?? [];
    }

    this._updateDivisionModel();

    this._updateForm();
  }

  private async _updateDivisionModel() {
    if (this._model) {
      this.defaultDivisionSource.set(
        DivisionLevel.Province,
        this._model.Province
      );
      this.defaultDivisionSource.set(DivisionLevel.City, this._model.City);
      this.defaultDivisionSource.set(DivisionLevel.County, this._model.County);
      this.defaultDivisionSource.set(DivisionLevel.Street, this._model.Street);
      this.defaultDivisionSource.set(
        DivisionLevel.Committee,
        this._model.Committee
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
  private async _createOrUpdateModel() {
    if (this._checkForm()) {
      if (!this._model) {
        this._model = new GarbageStationProfileModel();
        this._model.Id = Guid.NewGuid().ToString('N');
        this._model.ProfileState = 1;
      }
      this._model!.ProfileName = this.formGroup.value.ProfileName ?? '';
      this._model!.Province = this.formGroup.value.Province ?? '';
      this._model!.City = this.formGroup.value.City ?? '';
      this._model!.County = this.formGroup.value.County ?? '';
      this._model!.Street = this.formGroup.value.Street ?? '';
      this._model!.Committee = this.formGroup.value.Committee ?? '';
      this._model!.Address = this.formGroup.value.Address ?? '';
      this._model!.Contact = this.formGroup.value.Committee ?? '';
      this._model!.ContactPhoneNo = this.formGroup.value.ContactPhoneNo ?? '';
      this._model!.Labels = this.formGroup.value.Labels ?? [];

      if (this.state == FormState.add) {
        return this._business.createModel(this._model!);
      } else if (this.state == FormState.edit) {
        return this._business.updateModel(this._model);
      }
    }
    return null;
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

  private _updateForm() {
    if (this._model) {
      let controls = this.formGroup.controls;
      for (let [key, control] of Object.entries(controls)) {
        if (
          Reflect.get(this._model, key) != void 0 &&
          Reflect.get(this._model, key) !== '' &&
          Reflect.get(this._model, key) !== null
        ) {
          this.formGroup.patchValue({
            [key]: Reflect.get(this._model, key),
          });
        }
      }
    }
  }

  private _checkForm() {
    if (this.formGroup.invalid) {
      let controls = this.formGroup.controls;
      for (let [key, control] of Object.entries(controls)) {
        if (control.invalid) {
          if ('required' in control.errors!) {
            this._toastrService.warning(this.language[key] + '为必选项');
            break;
          }
          if ('maxlength' in control.errors!) {
            this._toastrService.warning(this.language[key] + '长度不对');
            break;
          }
          if ('pattern' in control.errors!) {
            this._toastrService.warning(this.language[key] + '格式不对');
            break;
          }
          if ('identityRevealed' in control.errors!) {
            this._toastrService.warning(this.language[key] + '至少选择一项');
            break;
          }
        }
      }
      return false;
    }
    return true;
  }
}
