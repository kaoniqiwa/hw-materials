import {
  Component,
  Directive,
  EventEmitter,
  Inject,
  Injectable,
  Input,
  Output,
} from '@angular/core';
import { FormControlStatus, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonFormInterface } from 'src/app/common/interfaces/common-form.interface';
import { FormState } from 'src/app/enum/form-state.enum';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/source.tool';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { PartialResult } from 'src/app/network/entity/partial-result.entity';
import { GarbageProfileDetailFormsBusiness } from './garbage-profile-details-forms.business';

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

  protected model: GarbageStationProfile | null = null;

  protected formGroup: FormGroup = new FormGroup({});

  constructor(
    protected _business: GarbageProfileDetailFormsBusiness,
    protected _toastrService: ToastrService,
    protected source: GarbageStationProfilesSourceTools,
    protected language: GarbageStationProfilesLanguageTools
  ) {}

  protected async init() {
    if (this.formId) {
      this.model = await this._business.getModel(this.formId);

      // let res = await this._business.getModelByState(this.formId, 2);
      // console.log('ppp', res);
    }
    this.formGroup.statusChanges.subscribe((status) => {
      this.formStatus.emit(status);
    });
    this.updateForm();
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

  updateForm() {
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
    let res: GarbageStationProfile | null | PartialResult<any>;
    res = await this.createOrUpdateModel();
    if (res) {
      this._toastrService.success('操作成功');
      this.close.emit();
    }
  }
  async clickNext() {
    let res: GarbageStationProfile | null | PartialResult<any>;
    res = await this.createOrUpdateModel();
    if (res) {
      this._toastrService.success('操作成功');
      this.next.emit(res.Id);
    }
  }
}
