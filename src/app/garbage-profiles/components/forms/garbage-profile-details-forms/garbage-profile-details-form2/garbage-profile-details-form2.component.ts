import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
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
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Medium } from 'src/app/common/tools/medium';
import { GarbageStationFunction } from 'src/app/enum/garbage-station-function.enum';
import { StrongCurrentWireMode } from 'src/app/enum/strong-current-wire-mode.enum';
import { YesOrNo } from 'src/app/enum/yes-or-no.enum';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-source.tool';
import { MaterialItem } from 'src/app/network/entity/material-item.enitty';
import { PartialData } from 'src/app/network/entity/partial-data.interface';
import { PutOutMaterialsParams } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.param';
import { _GarbageProfileDetailsFormsBase } from '../garbage-profile-details-form/garbage-profile-details-forms.common';
import { GarbageProfileDetailsForm2Business } from './garbage-profile-details-form2.business';

@Component({
  selector: 'garbage-profile-details-form2',
  templateUrl: './garbage-profile-details-form2.component.html',
  styleUrls: ['./garbage-profile-details-form2.component.less'],
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

  @Output()
  recordEvent = new EventEmitter<PartialData>();

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
    MaterialItems: new FormControl([]),
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

    if (this.formId) {
      this.model = await this._business.getModel(this.formId);
    }
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
    if (this.partialData) {
      if (this.partialData['MaterialItems']) {
        // this.showRecord = true;

        this.recordEvent.emit(this.partialData);
      }
    }
  }
  changeCurrentWire() {
    this._updateValidator(!!this.formGroup.value['StrongCurrentWire']);
  }

  override updatePartial() {
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
          this.partialData['Functions'] = [];

          if (this.formGroup.value['Functions'].garbagedrop) {
            this.partialData['Functions'].push(
              GarbageStationFunction.garbagedrop
            );
          }
          if (this.formGroup.value['Functions'].mixedinto) {
            this.partialData['Functions'].push(
              GarbageStationFunction.mixedinto
            );
          }
          if (this.formGroup.value['Functions'].garbagefull) {
            this.partialData['Functions'].push(
              GarbageStationFunction.garbagefull
            );
          }
        } else {
          this.partialRequest.ModificationReason = '';

          this.partialRequest.ModificationContent = '';

          let oldData = _.cloneDeep(this.partialData);
          let newData = _.cloneDeep(this.formGroup.value);

          newData['Functions'] = [];

          if (this.formGroup.value['Functions'].garbagedrop) {
            newData['Functions'].push(GarbageStationFunction.garbagedrop);
          }
          if (this.formGroup.value['Functions'].mixedinto) {
            newData['Functions'].push(GarbageStationFunction.mixedinto);
          }
          if (this.formGroup.value['Functions'].garbagefull) {
            newData['Functions'].push(GarbageStationFunction.garbagefull);
          }

          for (let [key, value] of Object.entries(newData)) {
            let newValue = value;
            let oldValue = oldData[key];

            if (value != void 0 && value !== '' && value !== null) {
              if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                this.simpleChanges[key] = {
                  OldValue: oldValue,
                  NewValue: newValue,
                };
                this.partialData[key] = newValue;
              }
            }
          }

          if (Object.keys(this.simpleChanges).length) {
            this.hasBeenModified = true;
            this.willBeUpdated = true;
            this.partialRequest.ModificationContent = JSON.stringify(
              this.simpleChanges
            );
          } else {
            this.hasBeenModified = false;
            this.willBeUpdated = false;
          }
        }
        this.partialRequest.Data = this.partialData;
      } else {
        this.willBeUpdated = false;
        this.hasBeenModified = false;
      }

      console.log(this.simpleChanges);
      console.log(this.partialRequest);
      return true;
    }

    return false;
  }

  async okHandler(params: PutOutMaterialsParams) {
    this.showPutout = false;

    if (this.model) {
      params.ProfileId = this.model.Id;
      params.ProfileName = this.model.ProfileName;
      let res = await this._business.putout(params);
      let newItems = res.MaterialItems;
      let oldItems = this.formGroup.get('MaterialItems')!
        .value as MaterialItem[];

      newItems.forEach((item) => {
        let findItem = oldItems.find((oldItem) => oldItem.Id == item.Id);
        if (findItem) {
          findItem.Number += item.Number;
        } else {
          oldItems.push(item);
        }
      });
      this.formGroup.get('MaterialItems')!.patchValue(oldItems);

      console.log(this.partialData);
      console.log(this.formGroup.value);
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
    if (this.partialData) {
      let functionGroup = this.formGroup.get('Functions')!;
      functionGroup.setValue({
        garbagedrop: false,
        mixedinto: false,
        garbagefull: false,
      });
      (this.partialData['Functions'] as Array<any>).forEach((v) => {
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

      if (this.partialData['StrongCurrentWire'] == YesOrNo.yes) {
        this.changeCurrentWire();

        this.formGroup.patchValue({
          StrongCurrentWireMode: this.partialData['StrongCurrentWireMode'],
          StrongCurrentWireLength: this.partialData['StrongCurrentWireLength'],
        });
      }
      if (this.partialData['LFImageUrl']) {
        this.LFImageUrl = Medium.jpg(this.partialData['LFImageUrl']);
      }

      if (this.partialData['RFImageUrl']) {
        this.RFImageUrl = Medium.jpg(this.partialData['RFImageUrl']);
      }
      if (this.partialData['FImageUrl']) {
        this.FImageUrl = Medium.jpg(this.partialData['FImageUrl']);
      }
      if (this.partialData['PowerImageUrl']) {
        this.PowerImageUrl = Medium.jpg(this.partialData['PowerImageUrl']);
      }
    }
  }
}
