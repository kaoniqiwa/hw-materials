import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
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
import { StrongCurrentWireMode } from 'src/app/enum/strong-current-wire-mode.enum';
import { YesOrNo } from 'src/app/enum/yes-or-no.enum';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/source.tool';
import { GarbageStationProfileModel } from 'src/app/model/garbage-station-profile.model';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { PutOutMaterialsParams } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.param';
import { GarbageProfileDetailsFormsCommon } from '../garbage-profile-details-forms.common';
import { GarbageProfileDetailsForm2Business } from './garbage-profile-details-form2.business';

@Component({
  selector: 'garbage-profile-details-form2',
  templateUrl: './garbage-profile-details-form2.component.html',
  styleUrls: ['./garbage-profile-details-form2.component.less'],
  providers: [GarbageProfileDetailsForm2Business],
})
export class GarbageProfileDetailsForm2
  extends GarbageProfileDetailsFormsCommon
  implements OnInit
{
  showPutout = false;

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
    _toastrService: ToastrService,
    private changeDetector: ChangeDetectorRef
  ) {
    super(_business, _toastrService, source, language);
  }

  async ngOnInit() {
    await this.init();

    console.log(this.formGroup.value);
    this._updateCustomForm();

    this.changeDetector.detectChanges();
  }

  uploadLFImage(id: string) {
    console.log(id);

    this.formGroup.patchValue({
      LFImageUrl: id,
    });
  }

  changeCurrentWire() {
    this._updateValidator(!!this.formGroup.value['StrongCurrentWire']);
  }
  protected async createOrUpdateModel() {
    console.log(this.formGroup.value);

    if (this.checkForm()) {
      if (!this.model) {
        this.model = new GarbageStationProfile();
        this.model.Id = Guid.NewGuid().ToString('N');
        this.model.ProfileState = 1;
      }
      if (this.model.ProfileState <= this.stepIndex) {
        ++this.model.ProfileState;
      }
      // this.model.GarbageStationName =
      //   this.formGroup.value['GarbageStationName'] ?? '';
      // this.model.CommunityName = this.formGroup.value['CommunityName'] ?? '';
      // this.model.StrongCurrentWire =
      //   this.formGroup.value['StrongCurrentWire'] ?? '';
      // this.model.StrongCurrentWireMode =
      //   this.formGroup.value['StrongCurrentWireMode'];
      // this.model.StrongCurrentWireLength =
      //   this.formGroup.value['StrongCurrentWireLength'];

      // this.model.LFImageUrl = this.formGroup.value['LFImageUrl'] ?? '';
      // this.model.RFImageUrl = this.formGroup.value['RFImageUrl'] ?? '';
      // this.model.FImageUrl = this.formGroup.value['FImageUrl'] ?? '';
      // this.model.PowerImageUrl = this.formGroup.value['PowerImageUrl'] ?? '';
      // this.model.GarbageStationType =
      //   this.formGroup.value['GarbageStationType'] ?? '';
      // this.model.Remarks = this.formGroup.value['Remarks'] ?? '';

      Object.assign(this.model, this.formGroup.value);
      this.model.Functions = [];

      if (this.formGroup.value['Functions'].garbagedrop) {
        this.model.Functions.push(GarbageStationFunction.garbagedrop);
      }
      if (this.formGroup.value['Functions'].mixedinto) {
        this.model.Functions.push(GarbageStationFunction.mixedinto);
      }
      if (this.formGroup.value['Functions'].garbagefull) {
        this.model.Functions.push(GarbageStationFunction.garbagefull);
      }

      if (this.state == FormState.add) {
        return this._business.createModel(this.model);
      } else if (this.state == FormState.edit) {
        return this._business.updateModel(this.model);
      }
    }

    return null;
  }

  async okHandler(params: PutOutMaterialsParams) {
    // console.log(params);
    // this.showPutout = false;
    // console.log(this._model);
    // if (this._model) {
    //   params.ProfileId = this._model.Id;
    //   params.ProfileName = this._model.ProfileName;
    //   let res = await this._business.putout(params);
    //   console.log(res);
    //   this._model.MaterialItems = res.MaterialItems;
    //   this._business.updateModel(this._model);
    // }
  }
  cancelHandler() {
    this.showPutout = false;
  }

  private _updateValidator(value: boolean) {
    if (value) {
      this.formGroup.addControl(
        'StrongCurrentWireMode',
        new FormControl(StrongCurrentWireMode.overheadline, Validators.required)
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
    if (this.model) {
      let functionGroup = this.formGroup.get('Functions')!;
      functionGroup.setValue({
        garbagedrop: false,
        mixedinto: false,
        garbagefull: false,
      });
      this.model.Functions?.forEach((v) => {
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

      if (this.model.StrongCurrentWire == YesOrNo.yes) {
        this.changeCurrentWire();

        this.formGroup.patchValue({
          StrongCurrentWireMode: this.model.StrongCurrentWireMode,
          StrongCurrentWireLength: this.model.StrongCurrentWireLength,
        });
      }
    }
  }
}
