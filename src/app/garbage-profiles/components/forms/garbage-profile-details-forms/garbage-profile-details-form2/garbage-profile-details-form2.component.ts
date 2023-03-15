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
import { Medium } from 'src/app/common/tools/medium';
import { FormState } from 'src/app/enum/form-state.enum';
import { GarbageStationFunction } from 'src/app/enum/garbage-station-function.enum';
import { StrongCurrentWireMode } from 'src/app/enum/strong-current-wire-mode.enum';
import { YesOrNo } from 'src/app/enum/yes-or-no.enum';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/source.tool';
import { GarbageStationProfileModel } from 'src/app/model/garbage-station-profile.model';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { PutOutMaterialsParams } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.param';
import { _GarbageProfileDetailsFormsBase } from '../garbage-profile-details-forms.common';
import { GarbageProfileDetailsForm2Business } from './garbage-profile-details-form2.business';

@Component({
  selector: 'garbage-profile-details-form2',
  templateUrl: './garbage-profile-details-form2.component.html',
  styleUrls: [
    './garbage-profile-details-form2.component.less',
    '../garbage-profile-details.less',
  ],
  providers: [GarbageProfileDetailsForm2Business],
})
export class GarbageProfileDetailsForm2
  extends _GarbageProfileDetailsFormsBase
  implements OnInit
{
  showPutout = false;
  showRecord = false;
  LFImageUrl = '';
  RFImageUrl = '';
  FImageUrl = '';
  PowerImageUrl = '';

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
  override formGroup = new FormGroup<{ [key: string]: AbstractControl }>({
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
    override _business: GarbageProfileDetailsForm2Business,
    _toastrService: ToastrService,
    private changeDetector: ChangeDetectorRef
  ) {
    super(_business, _toastrService, source, language);
  }

  async ngOnInit() {
    this._init();
  }

  private async _init() {
    await this.init();

    this._updateCustomForm();

    this.changeDetector.detectChanges();
  }

  uploadLFImage(id: string) {
    this.formGroup.patchValue({
      LFImageUrl: id,
    });
  }
  uploadRFImage(id: string) {
    this.formGroup.patchValue({
      RFImageUrl: id,
    });
  }
  uploadFImage(id: string) {
    this.formGroup.patchValue({
      FImageUrl: id,
    });
  }
  uploadPowerImage(id: string) {
    this.formGroup.patchValue({
      PowerImageUrl: id,
    });
  }

  changeCurrentWire() {
    this._updateValidator(!!this.formGroup.value['StrongCurrentWire']);
  }
  protected override async createOrUpdateModel() {
    if (this.checkForm()) {
      if (!this.model) {
        this.model = new GarbageStationProfile();
        this.model.ProfileState = 1;
      }
      if (this.model.ProfileState <= this.stepIndex) {
        ++this.model.ProfileState;
      }

      let objData = this.formGroup.value;
      for (let [key, value] of Object.entries(objData)) {
        if (value != void 0 && value !== '' && value !== null) {
          Reflect.set(this.model, key, value);
        }
      }
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
        this.model = await this._business.createModel(this.model!);
        return this.model;
      } else if (this.state == FormState.edit) {
        this.model = await this._business.updateModel(this.model);
        return this.model;
      }
    }

    return null;
  }

  async okHandler(params: PutOutMaterialsParams) {
    // console.log(params);
    this.showPutout = false;
    if (this.model) {
      params.ProfileId = this.model.Id;
      params.ProfileName = this.model.ProfileName;
      let res = await this._business.putout(params);
      console.log(res);
      this.model.MaterialItems = res.MaterialItems;
      let res2 = await this._business.updateModel(this.model);
      console.log(res2);
    }
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
      if (this.model.LFImageUrl) {
        this.LFImageUrl = Medium.jpg(this.model.LFImageUrl);
      }

      if (this.model.RFImageUrl) {
        this.RFImageUrl = Medium.jpg(this.model.RFImageUrl);
      }

      if (this.model.FImageUrl) {
        this.FImageUrl = Medium.jpg(this.model.FImageUrl);
      }

      if (this.model.PowerImageUrl) {
        this.PowerImageUrl = Medium.jpg(this.model.PowerImageUrl);
      }
    }
  }
}
