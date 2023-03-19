import {
  Component,
  Directive,
  EventEmitter,
  Inject,
  Injectable,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import _ from "lodash";

import { FormControlStatus, FormGroup } from '@angular/forms';
import { instanceToPlain } from 'class-transformer';
import { ToastrService } from 'ngx-toastr';
import { FormState } from 'src/app/enum/form-state.enum';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/source.tool';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { PartialData } from 'src/app/network/entity/partial-data.interface';
import { PartialResult } from 'src/app/network/entity/partial-result.entity';
import { Property } from 'src/app/network/entity/property.entity';
import { PartialRequest } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { GarbageProfileDetailFormsBusiness } from './garbage-profile-details-forms.business';

export enum FormMode {
  ByModel,
  ByPartial,
}
@Directive({})
export abstract class _GarbageProfileDetailsFormsBase {
  @Input()
  formId?: string;

  @Input()
  state: FormState = FormState.none;

  @Input()
  stepIndex = 0;



  @Output() close = new EventEmitter();

  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();
  @Output() formStatus = new EventEmitter<FormControlStatus>();

  FormState = FormState;
  formMode = FormMode.ByPartial;
  maxState = 6;
  profileState = 0;

  partialRequest = new PartialRequest();
  simpleChanges: Record<string, any> = {};
  willBeUpdated = false;
  hasBeenModified = false;
  showModify = false;

  clickMode = '';

  protected model: GarbageStationProfile | null = null;

  protected formGroup: FormGroup = new FormGroup({});

  protected properties: Property[] = [];
  protected partialData: PartialData | null = null;

  constructor(
    protected _business: GarbageProfileDetailFormsBusiness,
    protected _toastrService: ToastrService,
    protected source: GarbageStationProfilesSourceTools,
    protected language: GarbageStationProfilesLanguageTools
  ) {
    this.formGroup.statusChanges.subscribe((status) => {
      this.formStatus.emit(status);
    });
  }

  // 没有特殊属性时
  protected async initByPartial() {
    this.properties = await this.getPropertyByCategory(this.stepIndex + 1);

    console.log('propertyArr', this.properties);
    this.partialData = await this.getPartialData(this.properties);
    console.log('partialData', this.partialData);

    if (this.partialData) {

      this.profileState = this.partialData['ProfileState'];
    }
    this.updateFormByPartial();
  }

  protected async getPropertyByCategory(category: number) {
    let profileState = await this.getProfileState();
    let res = await this._business.listProperty({
      Category: category,
    });

    res.push(...profileState);
    return res;
  }

  protected async getPartialData(propertys: Property[]) {
    if (this.formId) {
      let propertyIds = propertys.map((property) => property.Id);
      return await this._business.getPartialData(this.formId, propertyIds);
    }
    return null;
  }
  protected async getProfileState() {
    return this._business.listProperty({
      Name: 'ProfileState',
    });
  }
  protected async createModel() {
    if (this.checkForm()) {
      if (!this.model) {
        this.model = new GarbageStationProfile();
        this.model.ProfileState = 1;
      }

      let objData = this.formGroup.value;
      for (let [key, value] of Object.entries(objData)) {
        if (value != void 0 && value !== '' && value !== null) {
          Reflect.set(this.model, key, value);
        }
      }
      this.model = await this._business.createModel(this.model!);

      console.log('result', this.model);

      return this.model
    }
    return null;
  }
  updatePartial() {
    if (this.checkForm()) {
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


          this.partialRequest.ModificationReason = '';

          this.partialRequest.ModificationContent = '';

          let oldData = this.partialData;
          let newData = _.cloneDeep(this.formGroup.value);


          for (let [key, value] of Object.entries(newData)) {
            let newValue = value;
            let oldValue = oldData[key];

            if (value != void 0 && value !== '' && value !== null) {
              if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                this.simpleChanges[key] = {
                  OldValue: oldValue,
                  NewValue: newValue,
                }
                this.partialData[key] = newValue;

              }
            }

          }



          if (Object.keys(this.simpleChanges).length) {
            this.hasBeenModified = true;
            this.willBeUpdated = true;
            this.partialRequest.ModificationContent = JSON.stringify(this.simpleChanges);

          } else {
            this.hasBeenModified = false;
            this.willBeUpdated = false;
          }
        }
        this.partialRequest.Data = this.partialData

      } else {
        this.willBeUpdated = false;
        this.hasBeenModified = false;
      }
      console.log(this.simpleChanges)
      console.log(this.partialRequest)
      return true;
    }
    return false;
  }

  updateFormByPartial() {
    if (this.partialData) {
      let controls = this.formGroup.controls;
      for (let [key, control] of Object.entries(controls)) {
        if (
          Reflect.get(this.partialData, key) != void 0 &&
          Reflect.get(this.partialData, key) !== '' &&
          Reflect.get(this.partialData, key) !== null
        ) {
          this.formGroup.patchValue({
            [key]: Reflect.get(this.partialData, key),
          });
        }
      }
    }
  }

  checkForm() {
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
  async clickConfirm(reason: string) {
    this.partialRequest.ModificationReason = reason;
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
  async clickCreate() {
    let res = await this.createModel();
    if (res) {
      this._toastrService.success('创建成功');
      this.close.emit();
    }
  }
  async clickPrev() {
    this.previous.emit();
  }

  async clickSave() {
    this.clickMode = 'save';
    let res: GarbageStationProfile | null | PartialResult<any> = null;

    if (this.state == FormState.add) {
      res = await this.createModel();
      if (res) {
        this._toastrService.success('操作成功');
        this.close.emit();
      }
    } else if (this.state == FormState.edit) {
      if (this.updatePartial()) {
        if (this.willBeUpdated) {
          if (this.hasBeenModified) {
            this.showModify = true;
          } else {
            let res = await this._business.updatePartial(this.partialRequest);
            console.log(res)

            if (res.Succeed) {
              this._toastrService.success('操作成功');

              this.close.emit();
            } else {
              this.partialData!['ProfileState'] = this.profileState
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

    if (this.state == FormState.add) {
      res = await this.createModel();
      if (res) {
        this._toastrService.success('操作成功');
        this.next.emit(res.Id);
      }
    } else if (this.state == FormState.edit) {
      if (this.updatePartial()) {
        if (this.willBeUpdated) {
          if (this.hasBeenModified) {
            this.showModify = true;
          } else {
            let res = await this._business.updatePartial(this.partialRequest);

            console.log(res)
            if (res.Succeed) {
              this._toastrService.success('操作成功');

              this.next.emit(res.Id);
            } else {
              this.partialData!['ProfileState'] = this.profileState
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
  diff(oldObj: Record<string, any>, newObj: Record<string, any>) {
    for (let [key, value] of Object.entries(newObj)) {
      let newValue = value;
      let oldValue = oldObj[key];

      if (value != void 0 && value !== '' && value !== null) {
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          this.simpleChanges[key] = {
            OldValue: oldValue,
            NewValue: newValue,
          }
        }
      }

    }
  }
}

