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
import { PartialRequest } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { PutOutMaterialsParams } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.param';
import {
  FormMode,
  _GarbageProfileDetailsFormsBase,
} from '../garbage-profile-details-forms.common';
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
    this.formMode = FormMode.ByModel;
  }

  async ngOnInit() {
    this._init();
  }

  private async _init() {
    await this.initByPartial();

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
  clickRecord() {
    if (this.model?.MaterialItems?.length) {
      this.showRecord = true;
    }
  }
  changeCurrentWire() {
    this._updateValidator(!!this.formGroup.value['StrongCurrentWire']);
  }

  override updatePartial() {
    if (this.partialData) {
      if (this.partialData['ProfileState'] <= this.stepIndex) {
        this.partialRequest.ModificationReason = '新建档案';
        this.partialRequest.ModificationContent = '';
        this.willBeUpdated = true;
        ++this.partialData['ProfileState'];
      } else {
        this.partialRequest.ModificationReason = '';

        this.partialRequest.ModificationContent = '';
        let objData = this.formGroup.value;
        let content: Array<{ Name: string; OldValue: any; NewValue: any }> = [];
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
          this.hasBeenModified = true;
          this.willBeUpdated = true;
          this.partialRequest.ModificationContent = JSON.stringify(content);
          this.partialRequest.Data = this.partialData;
        } else {
          this.willBeUpdated = false;
          this.hasBeenModified = false;
        }
      }
      if (this.willBeUpdated) {
        let objData = this.formGroup.value;
        for (let [key, value] of Object.entries(objData)) {
          if (value != void 0 && value !== '' && value !== null) {
            Reflect.set(this.partialData, key, value);
          }
        }
        this.partialData['Functions'] = [];

        if (this.formGroup.value['Functions'].garbagedrop) {
          this.partialData['Functions'].push(
            GarbageStationFunction.garbagedrop
          );
        }
        if (this.formGroup.value['Functions'].mixedinto) {
          this.partialData['Functions'].push(GarbageStationFunction.mixedinto);
        }
        if (this.formGroup.value['Functions'].garbagefull) {
          this.partialData['Functions'].push(
            GarbageStationFunction.garbagefull
          );
        }

        this.partialRequest.Data = this.partialData;
      }
    } else {
      this.willBeUpdated = false;
      this.hasBeenModified = false;
    }
  }

  async okHandler(params: PutOutMaterialsParams) {
    // console.log(params);
    this.showPutout = false;
    if (this.model) {
      params.ProfileId = this.model.Id;
      params.ProfileName = this.model.ProfileName;
      let res = await this._business.putout(params);
      console.log(res);
      this.model.MaterialItems = this.model.MaterialItems ?? [];
      this.model.MaterialItems.push(...res.MaterialItems);
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
