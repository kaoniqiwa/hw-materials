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
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import path from 'path';
import { Guid } from 'src/app/common/tools/guid';
import { FormState } from 'src/app/enum/form-state.enum';
import { GarbageStationProfileModel } from 'src/app/model/garbage-station-profile.model';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { GarbageStationProfilesLanguageTools } from '../../tools/language.tool';
import { GarbageStationProfilesSourceTools } from '../../tools/source.tool';
import { GarbageStationProfileDetailsBusiness } from './garbage-station-profile-details.business';
import {
  getDivisionChildLevel,
  DivisionLevel,
  ProfileDetailsDivisionModel,
  ProfileDetailsDivisionSearchInfo,
} from './garbage-station-profile-details.model';

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

  @Input()
  formId?: string;

  @Input()
  state: FormState = FormState.none;

  @Output() closeDetails = new EventEmitter();

  @ViewChild('stepperTemp') stepperTemp?: TemplateRef<any>;
  @ViewChild('expansionTemp') expansionTemp?: TemplateRef<any>;
  @ViewChildren('step') stepList?: QueryList<TemplateRef<any>>;

  private _model: GarbageStationProfile | null = null;

  templateExpression: TemplateRef<any> | null = null;
  panelOpenState = false;
  stepLength = 4;

  labels = ['初建档案', '勘察完成', '安装完成', '现场调试'];

  // 也可以不初始化，使用undefined值
  completedArr: boolean[] = Array.from(Array(this.stepLength), () => false);

  divisionSearchInfo: ProfileDetailsDivisionSearchInfo = {};
  divisionModel: ProfileDetailsDivisionModel =
    new ProfileDetailsDivisionModel();

  formGroup = this._formBuilder.group({
    formArray: this._formBuilder.array([
      this._formBuilder.group({
        ProfileName: ['', Validators.required], //建档名称
        Province: ['', Validators.required], //省
        City: ['', Validators.required], //市
        County: ['', Validators.required], //区
        Street: ['', Validators.required], //街道
        Committee: ['', Validators.required], //居委会
        Address: ['', Validators.required], //地址
        Contact: [''], //联系人，
        ContactPhoneNo: [''], // 联系人电话
      }),
      this._formBuilder.group({
        GarbageStationName: ['', Validators.required],
        CommunityName: ['', Validators.required],
        StrongCurrentWire: ['', Validators.required],
        StrongCurrentWireMode: ['', Validators.required],
        StrongCurrentWireLength: ['', Validators.required],
      }),
      this._formBuilder.group({
        ConstructionContact: ['', Validators.required],
        ConstructionContactPhoneNo: ['', Validators.required],
        ConstructionDate: ['', Validators.required],
      }),
      this._formBuilder.group({
        GPSPoint: ['', Validators.required],
        TimeToDump: ['', Validators.required],
        IMEI: ['', Validators.required],
        NB: ['', Validators.required],
      }),
    ]),
  });

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
    this._init();
  }

  private async _init() {
    this._getDivisionList();
    if (this.state == FormState.add) {
      // 拉取下拉框信息
    } else if (this.state == FormState.edit) {
      if (this.formId) {
        this._model = await this._business.getModel(this.formId);
        console.log(this._model);

        let id = this._business.getDivision('上海市2');
        console.log(id);
        // this._updateForm();
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.stepperTemp) {
      this.templateExpression = this.stepperTemp;
    }
    // if (this.expansionTemp) {
    //   this.templateExpression = this.expansionTemp;
    // }

    this._changeDetector.detectChanges();
  }

  changeDivision(selectEle: HTMLSelectElement, level: DivisionLevel) {
    let selectedOption = selectEle.options[selectEle.selectedIndex];
    let id = selectedOption.id;

    console.log(`切换区划--level: ${level}--id: ${id}`);
    // 每次切换区划时，下级区划表单内容要清空
    this._patchData(level);
    this._getDivisionList(level, id);
  }
  async createInfo() {
    let res = await this._createModel();
    if (res) {
      this._model = res;
      this.closeDetails.emit();
    }
  }
  nextStep(index: number) {
    console.log('next step', index);
    let formGroup = this.formArray.at(0);

    console.log(formGroup.value);
  }
  selectionChange(e: StepperSelectionEvent) {
    console.log('selectionChange');
  }

  /**
   *
   * @param level 当前层级，需要请求下级信息
   * @param id
   */
  private async _getDivisionList(
    level: DivisionLevel = DivisionLevel.None,
    ParentId?: string
  ) {
    if (level == DivisionLevel.None) {
      this.divisionSearchInfo = {
        ParentIdIsNull: true,
      };
    } else {
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

      console.log('getDivision: ', this.divisionModel);
    }
  }

  private _patchData(level: DivisionLevel) {
    let formGroup = this.formArray.at(0);

    let patchValue: { [key: string]: any } = {};

    let childLevel = getDivisionChildLevel(level);

    while (childLevel) {
      patchValue[DivisionLevel[childLevel]] = '';
      this.divisionModel[DivisionLevel[childLevel]] = [];
      childLevel = getDivisionChildLevel(childLevel);
    }

    console.log('清空下级字段名: ', Object.keys(patchValue));
    formGroup.patchValue(patchValue);
  }

  private async _createModel() {
    let formIndex = 0;
    if (await this._checkForm(formIndex)) {
      let formGroup = this.formArray.at(formIndex) as FormGroup;

      let model = new GarbageStationProfileModel();
      model.Id = Guid.NewGuid().ToString('N');
      model.ProfileName = formGroup.value.ProfileName;
      model.Province = formGroup.value.Province;
      model.City = formGroup.value.City;
      model.County = formGroup.value.County;
      model.Street = formGroup.value.Street;
      model.Committee = formGroup.value.Committee;
      model.Address = formGroup.value.Address;
      model.Contact = formGroup.value.Contact;
      model.ContactPhoneNo = formGroup.value.ContactPhoneNo;
      model.ProfileState = 2;
      let res = await this._business.createModel(model);

      return res;
    }
    return null;
  }

  private async _checkForm(formIndex: number) {
    let formGroup = this.formArray.at(formIndex) as FormGroup;
    if (formGroup) {
      if (formGroup.invalid) {
        for (let key of Object.keys(formGroup.controls)) {
          let control = formGroup.controls[key];
          if (control.invalid) {
            this._toastrService.warning('请输入' + (await this.language[key]));
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
  private _setcompletedArr() {
    let profileState = this._model ? this._model.ProfileState : 0;
  }

  private _updateForm() {
    if (this.state == FormState.add) {
    } else if (this.state == FormState.edit) {
      if (this._model) {
        // for (let i = 0; i < this.stepLength; i++) {
        //   let formGroup = this.formArray.at(0);
        //   console.log(formGroup);
        //   for (let key in formGroup.controls) {
        //     // console.log(key);
        //     formGroup.patchValue({ [key]: Reflect.get(this._model, key) });
        //   }
        // }

        let formGroup = this.formArray.at(0);
        for (let key of Object.keys(formGroup.controls)) {
          console.log(key, Reflect.get(this._model, key));
          formGroup.patchValue({ [key]: Reflect.get(this._model, key) });
        }
      }
    }
  }
}
// 上海市
