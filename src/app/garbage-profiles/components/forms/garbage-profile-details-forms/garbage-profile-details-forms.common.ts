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
import { FormControlStatus, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonFormInterface } from 'src/app/common/interfaces/common-form.interface';
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
export abstract class _GarbageProfileDetailsFormsBase
  implements CommonFormInterface
{
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

  protected async initByModel() {
    if (this.formId) {
      this.model = await this._business.getModel(this.formId);
    }
    this.updateFormByModel();
  }
  // 没有特殊属性时
  protected async initByPartial() {
    this.properties = await this.getPropertyByCategory(this.stepIndex + 1);

    console.log('propertyArr', this.properties);
    this.partialData = await this.getPartialData(this.properties);
    console.log('partialData', this.partialData);
    this.updateFormByPartial();
  }
  protected async getProfileState() {
    return this._business.listProperty({
      Name: 'ProfileState',
    });
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
  protected async createOrUpdateModel() {
    if (this.checkForm()) {
      if (!this.model) {
        this.model = new GarbageStationProfile();
        this.model.ProfileState = 1;
      }
      if (this.model.ProfileState <= this.stepIndex) {
        ++this.model.ProfileState;
      }

      // Object.assign(this.model, this.formGroup.value);
      let objData = this.formGroup.value;
      for (let [key, value] of Object.entries(objData)) {
        if (value != void 0 && value !== '' && value !== null) {
          Reflect.set(this.model, key, value);
        }
      }

      if (this.state == FormState.add) {
        this.model = await this._business.createModel(this.model!);
        return this.model;
      } else if (this.state == FormState.edit) {
        this.model = await this._business.updateModel(this.model);
        return this.model;
      }
      console.log('result', this.model);
    }
    return null;
  }
  protected async updatePartialData() {
    if (this.checkForm()) {
      let willBeUpdated = false;
      let partialRequest = new PartialRequest();

      if (this.partialData) {
        if (this.partialData['ProfileState'] <= this.stepIndex) {
          ++this.partialData['ProfileState'];

          partialRequest.ModificationReason = '新建档案';
          partialRequest.ModificationContent = '';
          willBeUpdated = true;
        } else {
          partialRequest.ModificationReason =
            '更新档案' + ((Math.random() * 9999) >> 0);
          partialRequest.ModificationContent = '';

          let objData = this.formGroup.value;
          let content: Array<{ Name: string; OldValue: any; NewValue: any }> =
            [];
          for (let [key, value] of Object.entries(objData)) {
            if (value != void 0 && value !== '' && value !== null) {
              let oldValue = Reflect.get(this.partialData, key);
              let newValue = value;
              if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                content.push({
                  Name: key,
                  OldValue: oldValue,
                  NewValue: newValue,
                });
              }
            }
          }

          if (content.length) {
            willBeUpdated = true;
            partialRequest.ModificationContent = JSON.stringify(content);
          }

          console.log(partialRequest);
        }
        if (willBeUpdated) {
          let objData = this.formGroup.value;
          for (let [key, value] of Object.entries(objData)) {
            if (value != void 0 && value !== '' && value !== null) {
              Reflect.set(this.partialData, key, value);
            }
          }

          partialRequest.Data = this.partialData;

          let res = await this._business.updatePartial(partialRequest);

          return res;
        } else {
          // 验证通过，但无数据更新，不发送请求
          return -1;
        }
      }
    }
    return null;
  }
  updateFormByModel() {
    if (this.model) {
      let controls = this.formGroup.controls;
      for (let [key, control] of Object.entries(controls)) {
        if (
          Reflect.get(this.model, key) != void 0 &&
          Reflect.get(this.model, key) !== '' &&
          Reflect.get(this.model, key) !== null
        ) {
          this.formGroup.patchValue({
            [key]: Reflect.get(this.model, key),
          });
        }
      }
    }
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
  async clickCreate() {
    let res = await this.createOrUpdateModel();
    if (res) {
      this._toastrService.success('创建成功');
      this.close.emit();
    }
  }
  async clickPrev() {
    this.previous.emit();
  }

  async clickSave() {
    let res: GarbageStationProfile | null | PartialResult<any> | -1 = null;

    if (this.formMode == FormMode.ByModel) {
      res = await this.createOrUpdateModel();
    } else {
      if (this.state == FormState.add) {
        res = await this.createOrUpdateModel();
      } else if (this.state == FormState.edit) {
        res = await this.updatePartialData();
      }
    }
    if (res) {
      if (res instanceof GarbageStationProfile) {
        this._toastrService.success('操作成功');
        this.close.emit();
      } else if (res instanceof PartialResult) {
        if (res.Succeed) {
          this._toastrService.success('操作成功');
          this.close.emit();
        } else {
          this._toastrService.error('操作失败');
        }
      } else if (res == -1) {
        this._toastrService.success('无数据更新');
        this.close.emit();
      }
    }
  }
  async clickNext() {
    let res: GarbageStationProfile | null | PartialResult<any> | -1 = null;

    if (this.formMode == FormMode.ByModel) {
      res = await this.createOrUpdateModel();
    } else {
      if (this.state == FormState.add) {
        res = await this.createOrUpdateModel();
      } else if (this.state == FormState.edit) {
        res = await this.updatePartialData();
      }
    }
    if (res instanceof GarbageStationProfile) {
      this._toastrService.success('操作成功');
      this.next.emit(res.Id);
    } else if (res instanceof PartialResult) {
      if (res.Succeed) {
        this._toastrService.success('操作成功');
        this.next.emit(res.Id);
      } else {
        this._toastrService.error('操作失败');
      }
    } else if (res == -1) {
      this._toastrService.success('操作成功');
      this.close.emit();
    }
  }
}
