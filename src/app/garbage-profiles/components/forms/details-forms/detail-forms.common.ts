import { EventEmitter, Inject, Injectable, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/source.tool';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { DetailFormsBusiness } from './detail-forms.business';


@Injectable()
export abstract class DetailsFormsCommon {
  @Output() close = new EventEmitter();

  @Output() next = new EventEmitter();

  protected _model: GarbageStationProfile | null = null;
  protected _business: DetailFormsBusiness;
  protected _toastrService: ToastrService;
  public source: GarbageStationProfilesSourceTools;
  public language: GarbageStationProfilesLanguageTools;

  protected abstract formGroup: FormGroup;

  protected abstract _createOrUpdateModel(): Promise<GarbageStationProfile | null>;

  constructor(
    _business: DetailFormsBusiness,
    _toastrService: ToastrService,
    source: GarbageStationProfilesSourceTools,
    language: GarbageStationProfilesLanguageTools
  ) {
    this._business = _business;
    this._toastrService = _toastrService;
    this.source = source;
    this.language = language;
  }
  protected _updateForm() {
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

  protected _checkForm() {
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
}
