import {
  Component,
  Directive,
  EventEmitter,
  Inject,
  Injectable,
  Input,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonFormInterface } from 'src/app/common/interfaces/common-form.interface';
import { FormState } from 'src/app/enum/form-state.enum';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/source.tool';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { GarbageProfileDetailFormsBusiness } from './garbage-profile-details-forms.business';

@Directive({})
export abstract class GarbageProfileDetailsFormsCommon
  implements CommonFormInterface
{
  @Input()
  formId?: string;

  @Input()
  state: FormState = FormState.none;

  @Output() close = new EventEmitter();

  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();

  FormState = FormState;

  protected model: GarbageStationProfile | null = null;

  protected abstract formGroup: FormGroup;

  protected abstract createOrUpdateModel(): Promise<GarbageStationProfile | null>;

  constructor(
    protected _business: GarbageProfileDetailFormsBusiness,
    protected _toastrService: ToastrService,
    protected source: GarbageStationProfilesSourceTools,
    protected language: GarbageStationProfilesLanguageTools
  ) {}

  protected async init() {
    if (this.formId) {
      this.model = await this._business.getModel(this.formId);
    }

    this.updateForm();
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
    let res: GarbageStationProfile | null;
    res = await this.createOrUpdateModel();
    if (res) {
      this._toastrService.success('操作成功');
      this.close.emit();
    }
  }
  async clickNext() {
    let res: GarbageStationProfile | null;
    res = await this.createOrUpdateModel();
    if (res) {
      this._toastrService.success('操作成功');
      this.next.emit(res.Id);
    }
  }
}
