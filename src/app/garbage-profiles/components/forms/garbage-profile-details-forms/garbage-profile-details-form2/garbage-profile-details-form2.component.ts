import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Guid } from 'src/app/common/tools/guid';
import { FormState } from 'src/app/enum/form-state.enum';
import { GarbageStationFunction } from 'src/app/enum/garbage-station-function.enum';
import { YesOrNo } from 'src/app/enum/yes-or-no.enum';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/source.tool';
import { GarbageStationProfileModel } from 'src/app/model/garbage-station-profile.model';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { GarbageProfileDetailsFormsCommon } from '../garbage-profile-details-forms.common';
import { GarbageProfileDetailsForm2Business } from './garbage-profile-details-form2.business';

@Component({
  selector: 'garbage-profile-details-form2',
  templateUrl: './garbage-profile-details-form2.component.html',
  styleUrls: ['./garbage-profile-details-form2.component.less'],
  providers: [GarbageProfileDetailsForm2Business],
})
export class GarbageProfileDetailsForm2Component
  extends GarbageProfileDetailsFormsCommon
  implements OnInit
{
  identityRevealedValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const garbagedrop = control.get('garbagedrop');
    const mixedinto = control.get('mixedinto');
    const garbagefull = control.get('garbagefull');

    if (garbagedrop && mixedinto && garbagefull) {
      if (garbagedrop.value || mixedinto.value || garbagefull.value) {
        return null;
      }
    }
    return { identityRevealed: true };
  };
  formGroup = new FormGroup<{ [key: string]: AbstractControl }>({
    GarbageStationName: new FormControl('', Validators.required),
    CommunityName: new FormControl('', Validators.required),
    StrongCurrentWire: new FormControl(YesOrNo.no, Validators.required),
    LFImageUrl: new FormControl(''),
    RFImageUrl: new FormControl(''),
    FImageUrl: new FormControl(''),
    PowerImageUrl: new FormControl(''),
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
    GarbageStationType: new FormControl(2, Validators.required),
    Remarks: new FormControl(''),
  });

  constructor(
    source: GarbageStationProfilesSourceTools,
    language: GarbageStationProfilesLanguageTools,
    _business: GarbageProfileDetailsForm2Business,
    _toastrService: ToastrService
  ) {
    super(_business, _toastrService, source, language);
  }

  async ngOnInit() {
    await this._init();

    console.log(this.formGroup.value);
    this._updateCustomForm();
  }
  changeCurrentWire() {
    this._updateValidator(!!this.formGroup.value['StrongCurrentWire']);
  }
  protected async _createOrUpdateModel() {
    console.log(this.formGroup.value);

    if (this._checkForm()) {
      if (!this._model) {
        this._model = new GarbageStationProfileModel();
        this._model.Id = Guid.NewGuid().ToString('N');
        this._model.ProfileState = 1;
      } else {
        this._model.ProfileState = this._model.ProfileState + 1;
      }
      this._model.GarbageStationName =
        this.formGroup.value['GarbageStationName'] ?? '';
      this._model.CommunityName = this.formGroup.value['CommunityName'] ?? '';
      this._model.StrongCurrentWire =
        this.formGroup.value['StrongCurrentWire'] ?? '';
      this._model.LFImageUrl = this.formGroup.value['LFImageUrl'] ?? '';
      this._model.RFImageUrl = this.formGroup.value['RFImageUrl'] ?? '';
      this._model.FImageUrl = this.formGroup.value['FImageUrl'] ?? '';
      this._model.PowerImageUrl = this.formGroup.value['PowerImageUrl'] ?? '';
      this._model.GarbageStationType =
        this.formGroup.value['GarbageStationType'] ?? '';
      this._model.Remarks = this.formGroup.value['Remarks'] ?? '';
      this._model.Functions = [];

      // if (this.state == FormState.add) {
      //   return this._business.createModel(this._model!);
      // } else if (this.state == FormState.edit) {
      //   return this._business.updateModel(this._model);
      // }
    }

    return null;
  }
  private _updateValidator(value: boolean) {
    if (value) {
      this.formGroup.addControl(
        'StrongCurrentWireMode',
        new FormControl('', Validators.required)
      );
      this.formGroup.addControl(
        'StrongCurrentWireLength',
        new FormControl('', Validators.required)
      );
    } else {
      this.formGroup.removeControl('StrongCurrentWireMode');
      this.formGroup.removeControl('StrongCurrentWireLength');
    }
  }

  private _updateCustomForm() {
    if (this._model) {
      let functionGroup = this.formGroup.get('Functions')!;
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
