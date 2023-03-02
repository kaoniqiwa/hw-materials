import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Language } from 'src/app/common/tools/language';
import { FormState } from 'src/app/enum/form-state.enum';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { GarbageStationProfilesLanguageTools } from '../../tools/language.tool';
import { GarbageStationProfilesSourceTools } from '../../tools/source.tool';
import { GarbageStationProfileDetailsBusiness } from './garbage-station-profile-details.business';

@Component({
  selector: 'garbage-station-profile-details',
  templateUrl: './garbage-station-profile-details.component.html',
  styleUrls: ['./garbage-station-profile-details.component.less'],
  providers: [GarbageStationProfileDetailsBusiness],
})
export class GarbageStationProfileDetailsComponent
  implements OnInit, AfterViewInit
{
  @Input()
  formId?: string;

  @Input()
  state: FormState = FormState.none;

  @ViewChild('stepperTemp') stepperTemp?: TemplateRef<any>;
  @ViewChild('expansionTemp') expansionTemp?: TemplateRef<any>;
  @ViewChildren('step') stepList?: QueryList<TemplateRef<any>>;

  private _model: GarbageStationProfile | null = null;

  public templateExpression: TemplateRef<any> | null = null;
  public panelOpenState = false;
  public labels = ['初建档案', '勘察完成', '安装完成', '现场调试'];

  public formGroup = this._formBuilder.group({
    formArray: this._formBuilder.array([
      this._formBuilder.group({
        ProfileName: ['', Validators.required], //建档名称
        Province: ['上海市', Validators.required], //省
        City: ['市辖区', Validators.required], //市
        County: ['虹口区', Validators.required], //区
        Street: ['江湾镇街道', Validators.required], //街道
        Committee: ['', Validators.required], //居委会
        Address: ['', Validators.required], //地址
        Contact: [''], //联系人，
        ContactPhoneNo: [''], // 联系人电话
      }),
      this._formBuilder.group({
        GarbageStationName: ['', Validators.required],
        CommunityName: ['', Validators.required],
        StrongCurrentWire: ['', Validators.required],
        StrongCurrentWireMode: ['', Validators.required],
        StrongCurrentWireLength: ['', Validators.required],
      }),
      this._formBuilder.group({
        ConstructionContact: ['', Validators.required],
        ConstructionContactPhoneNo: ['', Validators.required],
        ConstructionDate: ['', Validators.required],
      }),
      this._formBuilder.group({
        GPSPoint: ['', Validators.required],
        TimeToDump: ['', Validators.required],
        IMEI: ['', Validators.required],
        NB: ['', Validators.required],
      }),
    ]),
  });
  myForm = this._formBuilder.group({
    ProfileName: ['', Validators.required], //建档名称
    Province: ['上海市', Validators.required], //省
    City: ['市辖区', Validators.required], //市
    County: ['虹口区', Validators.required], //区
    Street: ['江湾镇街道', Validators.required], //街道
    Committee: ['', Validators.required], //居委会
    Address: ['', Validators.required], //地址
  });

  public get formArray() {
    return this.formGroup.get('formArray') as FormArray<FormGroup>;
  }

  public getStepTemp(index: number) {
    return this.stepList ? this.stepList.get(index) ?? null : null;
  }
  constructor(
    public source: GarbageStationProfilesSourceTools,
    public language: GarbageStationProfilesLanguageTools,
    private _business: GarbageStationProfileDetailsBusiness,
    private _changeDetector: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _toastrService: ToastrService
  ) {}
  ngOnInit() {
    this._init();
  }

  private async _init() {
    if (this.formId) {
      this._model = await this._business.getModel(this.formId);
      console.log(this._model);
    }
  }

  ngAfterViewInit(): void {
    if (this.stepperTemp) {
      this.templateExpression = this.stepperTemp;
    }
    // if (this.expansionTemp) {
    //   this.templateExpression = this.expansionTemp;
    // }

    this._changeDetector.detectChanges();
  }
  selectionChange(e: StepperSelectionEvent) {
    console.log('selectionChange');
  }
}
