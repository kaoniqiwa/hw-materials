import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import _ from 'lodash';
import { map, Observable, startWith } from 'rxjs';
import { CommonFlatNode } from 'src/app/common/components/common-tree/common-flat-node.model';
import { ValidPhoneExp } from 'src/app/common/tools/tool';
import { DivisionLevel } from 'src/app/enum/division-level.enum';
import { EnumHelper } from 'src/app/enum/enum-helper';
import { FormState } from 'src/app/enum/form-state.enum';
import { PropertyCategory } from 'src/app/enum/property-category.enum';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-source.tool';
import { Division } from 'src/app/network/entity/division.entity';
import { PartialData } from 'src/app/network/entity/partial-data.interface';
import { Property } from 'src/app/network/entity/property.entity';
import { DivisionInfo } from '../../utils/division/division.model';
import { DivisionUtil } from '../../utils/division/division.util';
import { GarbageProfileReactiveForm1Business } from './garbage-profile-reactive-form1.business';
import { PartialRequest } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { PartialResult } from 'src/app/network/entity/partial-result.entity';
import { Modification } from '../../../../../common/components/modification-confirm/modification-confirm.model';

@Component({
  selector: 'garbage-profile-reactive-form1',
  templateUrl: './garbage-profile-reactive-form1.component.html',
  styleUrls: ['./garbage-profile-reactive-form1.component.less'],
  providers: [GarbageProfileReactiveForm1Business],
})
export class GarbageProfileReactiveForm1Component implements OnInit {
  DivisionLevel = DivisionLevel;

  @Input()
  formId?: string;

  @Input()
  formState: FormState = FormState.none;

  @Input() maxProfileState = 6;

  @Output() close = new EventEmitter();
  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();

  stepIndex = 0;
  profileState = 0;
  FormState = FormState;
  properties: Property[] = [];
  partialData: PartialData | null = null;
  partialRequest = new PartialRequest();
  simpleChanges: Record<string, any> = {};
  willBeUpdated = false;
  hasBeenModified = false;
  showModify = false;
  clickMode = '';

  model: GarbageStationProfile | null = null;

  private defaultProvince = '江苏省';
  private defaultCity = '南京市';
  private defaultCounty = '玄武区';
  private defaultStreet = '新街口街道';
  private defaultCommittee = '';

  divisionSource = new Map([
    [DivisionLevel.None, ''],
    [DivisionLevel.Province, this.defaultProvince],
    [DivisionLevel.City, this.defaultCity],
    [DivisionLevel.County, this.defaultCounty],
    [DivisionLevel.Street, this.defaultStreet],
    [DivisionLevel.Committee, this.defaultCommittee],
  ]);

  selectedNodes: CommonFlatNode[] = [];
  defaultIds: number[] = [];
  divisionInfo: DivisionInfo = new DivisionInfo();
  filteredOption: Observable<Division[]>;

  formGroup = new FormGroup<{ [key: string]: AbstractControl<any> }>({
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

  constructor(
    public sourceTool: GarbageStationProfilesSourceTools,
    public languageTool: GarbageStationProfilesLanguageTools,
    private _toastrService: ToastrService,
    private _changeDetector: ChangeDetectorRef,
    private _business: GarbageProfileReactiveForm1Business,
    private _divisionUtil: DivisionUtil
  ) {
    this.filteredOption = this.Committee.valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this._filterValue(value);
      })
    );
    this._divisionUtil.behaviorSubject.subscribe((data) => {
      // console.log('change data', data);

      this.divisionInfo = data;

      // 数据加载完成，触发一次 valueChange
      this.Committee.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this._init();
    this._divisionUtil.getChildDivisionListByName(this.divisionSource);
  }
  async clickCreate() {
    let res = await this._createModel();
    if (res) {
      this._toastrService.success('创建成功');
      this.close.emit();
    }
  }

  clickPrev() {
    this.previous.emit();
  }
  async clickSave() {
    this.clickMode = 'save';
    let res: GarbageStationProfile | null | PartialResult<any> = null;
    if (this.formState == FormState.add) {
      res = await this._createModel();
      if (res) {
        this._toastrService.success('操作成功');
        this.close.emit();
      }
    } else if (this.formState == FormState.edit) {
      if (this._updatePartialData()) {
        if (this.willBeUpdated) {
          if (this.hasBeenModified) {
            this.showModify = true;
          } else {
            let res = await this._business.updatePartial(this.partialRequest);
            console.log(res);
            if (res.Succeed) {
              this._toastrService.success('操作成功');
              this.close.emit();
            } else {
              this.partialData!['ProfileState'] = this.profileState;
              this._toastrService.success('操作失败');
            }
          }
        } else {
          this._toastrService.success('无数据更新');
          this.close.emit();
        }
      }
    }
  }
  async clickNext() {
    this.clickMode = 'next';
    let res: GarbageStationProfile | null | PartialResult<any> | -1 = null;

    if (this.formState == FormState.add) {
      res = await this._createModel();
      if (res) {
        this._toastrService.success('操作成功');
        this.next.emit(res.Id);
      }
    } else if (this.formState == FormState.edit) {
      if (this._updatePartialData()) {
        if (this.willBeUpdated) {
          if (this.hasBeenModified) {
            this.showModify = true;
          } else {
            let res = await this._business.updatePartial(this.partialRequest);

            console.log(res);
            if (res.Succeed) {
              this._toastrService.success('操作成功');

              this.next.emit(res.Id);
            } else {
              this.partialData!['ProfileState'] = this.profileState;
              this._toastrService.error('操作失败');
            }
          }
        } else {
          // this._toastrService.success('无数据更新');
          this.next.emit(this.formId);
        }
      }
    }
  }
  async clickConfirm(modification: Modification) {
    this.partialRequest.ModificationReason = modification.reason;
    this.partialRequest.ModificationContent = modification.content;
    let res = await this._business.updatePartial(this.partialRequest);
    console.log(res);
    if (res.Succeed) {
      this._toastrService.success('操作成功');
      if (this.clickMode == 'save') {
        this.close.emit();
      } else if ((this.clickMode = 'next')) {
        this.next.emit(res.Id);
      }
    } else {
      this._toastrService.error('操作失败');
    }
  }

  selectTreeNode(nodes: CommonFlatNode[]) {
    this.selectedNodes = nodes;
    this.formGroup.patchValue({
      Labels: nodes.map((n) => parseInt(n.Id)),
    });
  }
  changeDivision(level: DivisionLevel) {
    // 清空下级
    this._resetSelect(level);

    // 更新表单视图绑定,否则下拉框默认数据第一项
    this._changeDetector.detectChanges();

    this._getDivisionInfo(level);
  }

  private async _init() {
    this.properties = await this._business.getPropertyByCategory(
      this.stepIndex + 1
    );

    let extra = await this._business.getPropertyByNames([
      {
        Name: 'Labels',
        Category: PropertyCategory.operating,
      },
      {
        Name: 'ProfileState',
      },
    ]);

    this.properties.push(...extra.flat());
    // console.log(this.properties);

    this.partialData = await this._getPartialData(this.properties);
    // console.log('partialData', this.partialData);

    this._updateForm();
  }
  private _getPartialData(propertys: Property[]) {
    if (this.formId) {
      let propertyIds = propertys.map((property) => property.Id);
      return this._business.getPartialData(this.formId, propertyIds);
    }
    return null;
  }
  private async _createModel() {
    if (this._checkForm()) {
      if (!this.model) {
        this.model = new GarbageStationProfile();
        this.model.ProfileState = 1;
      }

      let objData = _.cloneDeep(this.formGroup.value);
      for (let [key, value] of Object.entries(objData)) {
        if (value != void 0 && value !== '' && value !== null) {
          Reflect.set(this.model, key, value);
        }
      }
      this.model = await this._business.createModel(this.model);

      console.log('result', this.model);

      return this.model;
    }
    return null;
  }
  private _updatePartialData() {
    if (this._checkForm()) {
      if (this.partialData) {
        if (this.partialData['ProfileState'] <= this.stepIndex) {
          ++this.partialData['ProfileState'];
          this.partialRequest.ModificationReason = '新建档案';
          this.partialRequest.ModificationContent = '';
          this.willBeUpdated = true;
          this.hasBeenModified = false;

          let newData = _.cloneDeep(this.formGroup.value);
          for (let [key, value] of Object.entries(newData)) {
            if (value != void 0 && value !== '' && value !== null) {
              Reflect.set(this.partialData, key, value);
            }
          }
        } else {
          this.willBeUpdated = false;
          this.hasBeenModified = false;
          this.partialRequest.ModificationReason = '';
          this.partialRequest.ModificationContent = '';

          let oldData = _.cloneDeep(this.partialData);
          let newData = _.cloneDeep(this.formGroup.value);

          for (let [key, value] of Object.entries(newData)) {
            let newValue = value;
            let oldValue = oldData[key];

            if (value != void 0 && value !== '' && value !== null) {
              if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                this.simpleChanges[key] = {
                  OldValue: oldValue,
                  NewValue: newValue,
                };
                this.partialData[key] = newValue;
              }
            }
          }

          if (Object.keys(this.simpleChanges).length) {
            this.hasBeenModified = true;
            this.willBeUpdated = true;
            this.partialRequest.ModificationContent = JSON.stringify(
              this.simpleChanges
            );
          } else {
            this.hasBeenModified = false;
            this.willBeUpdated = false;
          }
        }

        this.partialRequest.Data = this.partialData;
      } else {
        this.willBeUpdated = false;
        this.hasBeenModified = false;
      }
      return true;
    }
    return false;
  }

  private _getDivisionInfo(level: DivisionLevel) {
    let curLevel: DivisionLevel | null = level;

    while (curLevel) {
      this.divisionSource.set(
        curLevel,
        Reflect.get(this.formGroup.value, curLevel)
      );

      curLevel = EnumHelper.getDivisionChildLevel(curLevel);
    }
    this._divisionUtil.getChildDivisionListByName(this.divisionSource);
  }
  private _resetSelect(level: DivisionLevel) {
    let patchValue: { [key: string]: any } = {
      Address: '',
    };

    let childLevel = EnumHelper.getDivisionChildLevel(level);

    while (childLevel) {
      patchValue[DivisionLevel[childLevel]] = '';
      this.divisionInfo[DivisionLevel[childLevel]] = [];
      childLevel = EnumHelper.getDivisionChildLevel(childLevel);
    }

    // console.log('清空下级字段名: ', patchValue);
    this.formGroup.patchValue(patchValue);
  }
  private _filterValue(value: string) {
    if (value) {
      let filterValue = value.toLocaleLowerCase();
      return this.divisionInfo.Committee.filter((committee) =>
        committee.Name.toLocaleLowerCase().includes(filterValue)
      );
    } else {
      return this.divisionInfo.Committee.slice();
    }
  }
  private _updateForm() {
    if (this.partialData) {
      let controls = this.formGroup.controls;
      for (let [key, control] of Object.entries(controls)) {
        if (
          Reflect.get(this.partialData, key) != void 0 &&
          Reflect.get(this.partialData, key) !== '' &&
          Reflect.get(this.partialData, key) !== null
        ) {
          // 重新创建对象，比较差异
          this.formGroup.patchValue({
            [key]: _.cloneDeep(Reflect.get(this.partialData, key)),
          });
        }
      }

      // this.defaultIds = this.partialData['Labels'];
      this._changeDetector.detectChanges();

      this._getDivisionInfo(DivisionLevel.None);
    }
  }
  private _checkForm() {
    if (this.formGroup.invalid) {
      for (let [key, control] of Object.entries(this.formGroup.controls)) {
        if (control.invalid) {
          if ('required' in control.errors!) {
            this._toastrService.warning(this.languageTool[key] + '为必选项');
            break;
          }
          if ('maxlength' in control.errors!) {
            this._toastrService.warning(this.languageTool[key] + '长度不对');
            break;
          }
          if ('pattern' in control.errors!) {
            this._toastrService.warning(this.languageTool[key] + '格式不对');
            break;
          }
          if ('identityRevealed' in control.errors!) {
            this._toastrService.warning(
              this.languageTool[key] + '至少选择一项'
            );
            break;
          }
        }
      }
      return false;
    }

    return true;
  }
}
