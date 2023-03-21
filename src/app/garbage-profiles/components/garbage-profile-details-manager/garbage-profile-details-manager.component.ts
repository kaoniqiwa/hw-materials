import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormControlStatus } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { FormState } from 'src/app/enum/form-state.enum';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { PartialData } from 'src/app/network/entity/partial-data.interface';
import { ProfileDetailsBusiness } from './garbage-profile-details-manager.business';

@Component({
  selector: 'garbage-profile-details-manager',
  templateUrl: './garbage-profile-details-manager.component.html',
  styleUrls: ['./garbage-profile-details-manager.component.less'],
  providers: [
    {
      provide: ProfileDetailsBusiness,
      useClass: ProfileDetailsBusiness,
    },
  ],
})
export class GarbageProfileDetailsManager implements OnInit, AfterViewInit {
  @Input()
  formId?: string;

  @Input()
  jumpState?: number;

  @Input()
  formState: FormState = FormState.none;

  private _selectedIndex = 0;
  @Input()
  get selectedIndex() {
    return this._selectedIndex;
  }
  set selectedIndex(index: number) {
    this._selectedIndex = index;
  }

  @Output() closeDetails = new EventEmitter();
  @Output() updateDetails = new EventEmitter();

  @Output()
  recordEvent = new EventEmitter<PartialData>();

  @ViewChild('stepperTemp') stepperTemp?: TemplateRef<any>;
  @ViewChild('tabTemp') tabTemp?: TemplateRef<any>;
  @ViewChild('expansionTemp') expansionTemp?: TemplateRef<any>;
  @ViewChildren('step') stepList?: QueryList<TemplateRef<any>>;
  @ViewChild(MatStepper) matStepper?: MatStepper;

  private _model: GarbageStationProfile | null = null;

  templateExpression: TemplateRef<any> | null = null;
  profileState = 0;
  labels = [
    '初建档案',
    '勘察完成',
    '安装完成',
    '现场调试',
    '准备上线',
    '运营上线',
  ];
  stepLength = this.labels.length;

  completedArr: boolean[] = Array.from(Array(this.stepLength), () => false);

  getTemplate(index: number) {
    return this.stepList ? this.stepList.get(index) ?? null : null;
  }
  constructor(
    private _changeDetector: ChangeDetectorRef,
    private _business: ProfileDetailsBusiness
  ) {}

  ngOnInit(): void {
    this._init();
  }

  private async _init() {
    await this._updateState();
    if (this.stepperTemp) {
      this.templateExpression = this.stepperTemp;
    }

    if (this.profileState == 6) {
      if (this.expansionTemp) {
        this.templateExpression = this.expansionTemp;
      }
    }

    this._changeDetector.detectChanges();
  }
  ngAfterViewInit(): void {}
  selectionChange(e: StepperSelectionEvent) {
    // console.log('selection change', e);

    this.selectedIndex = e.selectedIndex;
  }
  opened(index: number) {
    this.selectedIndex = index;
  }
  closed(index: number) {
    // this.selectedIndex = -1;
  }
  closeEvent() {
    this.closeDetails.emit();
  }
  async nextEvent(id: string) {
    if (!this.formId) {
      this.formId = id;
    }
    this.formState = FormState.edit;
    await this._updateState();

    this.matStepper?.next();
  }

  previousEvent() {
    this.matStepper?.previous();
  }
  clickRecord(data: PartialData) {
    this.recordEvent.emit(data);
  }

  formStatus(status: FormControlStatus, index: number) {
    // console.log('formstatus', status);
  }
  private async _updateState() {
    if (this.formId) {
      this._model = await this._business.getModel(this.formId);
      console.log(this._model);
    }
    this.profileState = this._model ? this._model.ProfileState : 0;
    this.completedArr = this.completedArr.map((v, i) => {
      return i < this.profileState;
    });
    this._changeDetector.detectChanges();
  }
}
