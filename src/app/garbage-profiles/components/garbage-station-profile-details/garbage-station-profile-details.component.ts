import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ToastrService } from 'ngx-toastr';
import path from 'path';
import { CommonFlatNode } from 'src/app/common/components/common-tree/common-flat-node.model';
import { Guid } from 'src/app/common/tools/guid';
import { FormState } from 'src/app/enum/form-state.enum';
import { GarbageStationProfileModel } from 'src/app/model/garbage-station-profile.model';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { ValueNamePair } from 'src/app/network/entity/value-name-pair.entity';
import { GarbageStationProfilesLanguageTools } from '../../tools/language.tool';
import { GarbageStationProfilesSourceTools } from '../../tools/source.tool';
import { GarbageStationProfileDetailsBusiness } from './garbage-station-profile-details.business';
import {
  getDivisionChildLevel,
  DivisionLevel,
  ProfileDetailsDivisionModel,
  ProfileDetailsDivisionSearchInfo,
} from './garbage-station-profile-details.model';

import { GarbageStationFunction } from 'src/app/enum/garbage-station-function.enum';
import { DateTimePickerView } from 'src/app/common/directives/date-time-picker/date-time-picker.directive';

@Component({
  selector: 'garbage-station-profile-details',
  templateUrl: './garbage-station-profile-details.component.html',
  styleUrls: ['./garbage-station-profile-details.component.less'],
  providers: [GarbageStationProfileDetailsBusiness],
})
export class GarbageStationProfileDetailsComponent
  implements OnInit, AfterViewInit
{
  FormState = FormState;
  DivisionLevel = DivisionLevel;
  DateTimePickerView = DateTimePickerView;
  date: Date = new Date();

  @Input()
  formId?: string;

  @Input()
  jumpState = 0;

  @Input()
  state: FormState = FormState.none;

  @Output() closeDetails = new EventEmitter();

  @ViewChild('stepperTemp') stepperTemp?: TemplateRef<any>;
  @ViewChild('expansionTemp') expansionTemp?: TemplateRef<any>;
  @ViewChildren('step') stepList?: QueryList<TemplateRef<any>>;
  @ViewChild(MatStepper) matStepper?: MatStepper;

  private _model: GarbageStationProfile | null = null;

  templateExpression: TemplateRef<any> | null = null;
  panelOpenState = false;
  stepLength = 4;
  profileState = 0;
  selectedNodes: CommonFlatNode[] = [];
  defaultIds: string[] = [];

  labels = ['初建档案', '勘察完成', '安装完成', '现场调试'];

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

  // 也可以不初始化，使用undefined值
  completedArr: boolean[] = Array.from(Array(this.stepLength), () => false);

  divisionSearchInfo: ProfileDetailsDivisionSearchInfo = {};
  divisionModel: ProfileDetailsDivisionModel =
    new ProfileDetailsDivisionModel();

  /** A hero's name can't match the hero's alter ego */
  identityRevealedValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const garbagedrop = control.get('garbagedrop');
    const mixedinto = control.get('mixedinto');
    const garbagefull = control.get('garbagefull');

    // return name && alterEgo && name.value === alterEgo.value
    //   ? { identityRevealed: true }
    //   : null;
    if (garbagedrop && mixedinto && garbagefull) {
      if (garbagedrop.value || mixedinto.value || garbagefull.value) {
        return null;
      }
    }
    return { identityRevealed: true };
  };
  formGroup = this._formBuilder.group({
    formArray: this._formBuilder.array([
      this._formBuilder.group({
        ProfileName: ['', Validators.required], //建档名称
        Province: [this.defaultProvince, Validators.required], //省
        City: [this.defaultCity, Validators.required], //市
        County: [this.defaultCounty, Validators.required], //区
        Street: [this.defaultStreet, Validators.required], //街道
        Committee: [this.defaultCommittee, Validators.required], //居委会
        Address: ['', Validators.required], //地址
        Contact: [''], //联系人，
        ContactPhoneNo: [''], // 联系人电话
        Labels: [[]],
      }),
      this._formBuilder.group({
        GarbageStationName: ['', Validators.required],
        CommunityName: ['', Validators.required],
        StrongCurrentWire: ['', Validators.required],
        // StrongCurrentWireMode: [''],
        // StrongCurrentWireLength: [''],
        LFImageUrl: [''],
        RFImageUrl: [''],
        FImageUrl: [''],
        PowerImageUrl: [''],
        Functions: new FormGroup(
          {
            garbagedrop: new FormControl(false),
            mixedinto: new FormControl(false),
            garbagefull: new FormControl(false),
          },
          {
            validators: this.identityRevealedValidator,
          }
        ),
        GarbageStationType: ['', Validators.required],
        Remarks: ['', Validators.required],
        // MaterialItems: [''],
      }),
      this._formBuilder.group({
        ConstructionContact: ['', Validators.required],
        ConstructionContactPhoneNo: ['', Validators.required],
        ConstructionDate: [new Date(), Validators.required],
      }),
      this._formBuilder.group({
        GPSPoint: ['', Validators.required],
        TimeToDump: ['', Validators.required],
        IMEI: ['', Validators.required],
        NB: ['', Validators.required],
      }),
    ]),
  });
  array: number[] = [];
  get formArray() {
    return this.formGroup.get('formArray') as FormArray<FormGroup>;
  }

  getTemplate(index: number) {
    return this.stepList ? this.stepList.get(index) ?? null : null;
  }
  constructor(
    public source: GarbageStationProfilesSourceTools,
    public language: GarbageStationProfilesLanguageTools,
    private _business: GarbageStationProfileDetailsBusiness,
    private _changeDetector: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _toastrService: ToastrService
  ) {}
  ngOnInit() {
    this.formArray.controls.forEach((control, index) => {
      // console.log(control);
      control.statusChanges.subscribe((status) => {
        // console.log('status change', status, index);
        if (status == 'INVALID') {
          this.completedArr[index] = false;
        } else if (status == 'VALID') {
          this.completedArr[index] = true;
        }
      });
    });
    this._init();
  }

  private async _init() {
    // console.log(this.source.ProfileState);
    if (this.state == FormState.edit) {
      if (this.formId) {
        this._model = await this._business.getModel(this.formId);
        console.log(this._model);
      }
    }
    // 更新表单状态
    this._updateForm();

    console.log(this.formArray);

    // 拉数据
    this._updateDivisionModel();

    // 更新 profileState状态
    this._updateProfileState();

    // 根据 profileState 控制 step的 completed 值
    this._setcompletedArr();
  }

  ngAfterViewInit(): void {
    if (this.stepperTemp) {
      this.templateExpression = this.stepperTemp;
    }
    // if (this.expansionTemp) {
    //   this.templateExpression = this.expansionTemp;
    // }

    this._changeDetector.detectChanges();
    // console.log(this.matStepper);
  }

  changeDivision(selectEle: HTMLSelectElement, level: DivisionLevel) {
    let selectedOption = selectEle.options[selectEle.selectedIndex];
    let id = selectedOption.id;

    console.log(`切换区划--level: ${level}--id: ${id}`);
    // 每次切换区划时，下级区划表单内容要清空
    this._resetSelect(level);

    this._getChildDivisionListById(level, id);
  }
  changeCurrentWire(formGroupDirective: FormGroupDirective) {
    // console.log('sdf', formGroupDirective);

    this._updateValidator(!!formGroupDirective.value.StrongCurrentWire);
  }
  changeCheckBox(data: any) {
    console.log('checkbox', data);
  }
  onTreeNodeSelected(nodes: CommonFlatNode[]) {
    this.selectedNodes = nodes;
    let ids = this.selectedNodes.map((n) => parseInt(n.Id));

    this.formArray.at(0).patchValue({
      Labels: ids,
    });
  }
  changeDate(date: Date) {}
  changeStep(e: StepperSelectionEvent) {
    // console.log('selectionChange', e);
    // this.nextStep(e.selectedIndex);
  }
  async createInfo() {
    let res = await this._createModel();
    if (res) {
      this._model = res;
      this.closeDetails.emit();
    }
  }
  async saveInfo(formIndex: number) {
    let form = this.formArray.at(formIndex);
    console.log(form);
    let res = await this._updateModel(formIndex);
    if (res) {
      this.closeDetails.emit();
    }
  }

  async prevStep(index: number) {
    console.log('previous step', index);

    let res = await this._updateModel(index);
    if (res) {
      if (this.profileState > index) {
        this.matStepper?.previous();
      } else {
        this._toastrService.warning('操作失败');
      }
    }
  }

  async nextStep(index: number) {
    console.log('next step', index);

    // let res = await this._updateModel(index);
    // if (res) {
    //   if (this.profileState > index) {
    //     this.matStepper?.next();
    //   } else {
    //     this._toastrService.warning('操作失败');
    //   }
    // }
    let res: GarbageStationProfile | null;
    if (this.state == FormState.add) {
      res = await this._createModel();

      this.state = FormState.edit;
    } else {
      res = await this._updateModel(index);
    }
    if (res) {
      this._updateProfileState();
      if (this.profileState > index) {
        this.matStepper?.next();
      } else {
        this._toastrService.warning('操作失败');
      }
    }
    console.log(res);
  }

  uploadLFImage(id: string) {
    console.log(id);
    let formGroup = this.formArray.at(1);

    formGroup.patchValue({
      LFImageUrl: id,
    });
  }
  uploadRFImage(id: string) {
    console.log(id);
    let formGroup = this.formArray.at(1);

    formGroup.patchValue({
      RFImageUrl: id,
    });
  }
  uploadFImage(id: string) {
    console.log(id);
    let formGroup = this.formArray.at(1);

    formGroup.patchValue({
      FImageUrl: id,
    });
  }
  uploadPowerImage(id: string) {
    console.log(id);
    let formGroup = this.formArray.at(1);

    formGroup.patchValue({
      PowerImageUrl: id,
    });
  }
  /***********************private***************************************** */

  private _resetSelect(level: DivisionLevel) {
    let formGroup = this.formArray.at(0);

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
    formGroup.patchValue(patchValue);
  }

  private async _createModel() {
    let formIndex = 0;
    if (await this._checkForm(formIndex)) {
      let formGroup = this.formArray.at(formIndex) as FormGroup;

      let model = new GarbageStationProfileModel();
      model.Id = Guid.NewGuid().ToString('N');

      Object.assign(model, formGroup.value);
      model.ProfileState = 1;
      let res = await this._business.createModel(model);

      return res;
    }
    return null;
  }

  private async _updateModel(formIndex: number) {
    let formGroup = this.formArray.at(formIndex) as FormGroup;

    console.log(formGroup.value);
    if (await this._checkForm(formIndex)) {
      let formGroup = this.formArray.at(formIndex) as FormGroup;

      if (this._model) {
        Object.assign(this._model, formGroup.value);
        if ('Functions' in formGroup.value) {
          this._model.Functions = [];

          if (formGroup.value.Functions.garbagedrop) {
            this._model.Functions.push(GarbageStationFunction.garbagedrop);
          }
          if (formGroup.value.Functions.mixedinto) {
            this._model.Functions.push(GarbageStationFunction.mixedinto);
          }
          if (formGroup.value.Functions.garbagefull) {
            this._model.Functions.push(GarbageStationFunction.garbagefull);
          }
        }

        if (this.profileState <= formIndex) {
          this._model.ProfileState = ++formIndex;
        }
        let res = await this._business.updateModel(this._model);
        console.log('update', res);
        return res;
      }
    }
    return null;
  }
  private _updateValidator(value: boolean) {
    let formIndex = 1;
    let formGroup = this.formArray.at(formIndex) as FormGroup;
    if (value) {
      formGroup.addControl(
        'StrongCurrentWireMode',
        this._formBuilder.control('', { validators: [Validators.required] })
      );
      formGroup.addControl(
        'StrongCurrentWireLength',
        this._formBuilder.control('', { validators: [Validators.required] })
      );
    } else {
      formGroup.removeControl('StrongCurrentWireMode');
      formGroup.removeControl('StrongCurrentWireLength');
    }
  }

  private _setcompletedArr() {
    this.completedArr = this.completedArr.map((v, i) => {
      return i < this.profileState;
    });
    // console.log(this.completedArr);
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
  private _updateProfileState() {
    this.profileState = this._model ? this._model.ProfileState : 0;
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
      this.divisionModel[
        DivisionLevel[childLevel] as keyof ProfileDetailsDivisionModel
      ] = res;
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
    if (this.state == FormState.edit) {
      if (this._model) {
        for (let i = 0; i < this.formArray.length; i++) {
          let formGroup = this.formArray.at(i);
          for (let key of Object.keys(formGroup.controls)) {
            if (Reflect.get(this._model, key) != void 0) {
              formGroup.patchValue({
                [key]: Reflect.get(this._model, key),
              });
            }
          }
          if ('Functions' in this._model && formGroup.contains('Functions')) {
            let functionGroup = formGroup.get('Functions')!;
            // console.log(functionGroup);
            functionGroup.setValue({
              garbagedrop: false,
              mixedinto: false,
              garbagefull: false,
            });
            this._model.Functions?.forEach((v) => {
              if (v == GarbageStationFunction.garbagedrop) {
                functionGroup.patchValue({
                  garbagedrop: true,
                });
              }
              if (v == GarbageStationFunction.mixedinto) {
                functionGroup.patchValue({
                  mixedinto: true,
                });
              }
              if (v == GarbageStationFunction.garbagefull) {
                functionGroup.patchValue({
                  garbagefull: true,
                });
              }
            });
          }
        }
      }
    }
  }
  private async _checkForm(formIndex: number) {
    let formGroup = this.formArray.at(formIndex) as FormGroup;
    if (formGroup) {
      if (formGroup.invalid) {
        for (let key of Object.keys(formGroup.controls)) {
          let control = formGroup.controls[key];
          if (control.invalid) {
            this._toastrService.warning(
              (await this.language[key]) + '为必选项'
            );
            break;
          }
        }
        return false;
      }
      return true;
    } else {
      return false;
    }
  }
}
