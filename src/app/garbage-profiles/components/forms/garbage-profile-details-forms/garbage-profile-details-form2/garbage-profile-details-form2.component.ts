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
import { FormState } from 'src/app/enum/form-state.enum';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/source.tool';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { DetailsForm2Business } from './garbage-profile-details-form2.business';

@Component({
  selector: 'garbage-profile-details-form2',
  templateUrl: './garbage-profile-details-form2.component.html',
  styleUrls: ['./garbage-profile-details-form2.component.less'],
  providers: [DetailsForm2Business],
})
export class DetailsForm2Component implements OnInit {
  FormState = FormState;

  @Input()
  formId?: string;

  @Input()
  state: FormState = FormState.none;

  @Output() close = new EventEmitter();

  @Output() next = new EventEmitter();

  private _model: GarbageStationProfile | null = null;
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
  formGroup = new FormGroup({
    GarbageStationName: new FormControl('', Validators.required),
    CommunityName: new FormControl('', Validators.required),
    StrongCurrentWire: new FormControl('', Validators.required),
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
    GarbageStationType: new FormControl(1, Validators.required),
    Remarks: new FormControl(''),
  });

  constructor(
    public source: GarbageStationProfilesSourceTools,
    public language: GarbageStationProfilesLanguageTools,
    private _business: DetailsForm2Business,
    private _toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this._init();
  }
  private async _init() {
    if (this.formId) {
      this._model = await this._business.getModel(this.formId);
      console.log(this._model);
    }
  }
}
