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
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FormState } from 'src/app/enum/form-state.enum';
import { ViewMode } from 'src/app/enum/view-mode.enum';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { PartialData } from 'src/app/network/entity/partial-data.interface';
import { ValueNamePair } from 'src/app/network/entity/value-name-pair.entity';
import { GarbageStationProfilesSourceTools } from '../../tools/garbage-station-profile-source.tool';
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

  @ViewChild('stepperTemp', { static: true }) stepperTemp!: TemplateRef<any>;
  @ViewChild('tabTemp', { static: true }) tabTemp!: TemplateRef<any>;
  @ViewChild('expansionTemp', { static: true })
  expansionTemp!: TemplateRef<any>;
  @ViewChild(MatStepper, { static: true }) matStepper!: MatStepper;
  @ViewChildren('step') stepList?: QueryList<TemplateRef<any>>;

  profileState = 0;
  maxProfileState = 6;
  labelData: Array<ValueNamePair> = this.source['ProfileState'];

  completedArr: boolean[] = [];

  model: GarbageStationProfile | null = null;
  templateExpression: TemplateRef<any> | null = null;
  viewMode = ViewMode.Stepper;

  getTemplate(index: number) {
    return this.stepList ? this.stepList.get(index) ?? null : null;
  }
  constructor(
    private source: GarbageStationProfilesSourceTools,

    private _changeDetector: ChangeDetectorRef,
    private _business: ProfileDetailsBusiness
  ) {
    this.labelData = this.labelData.filter((data) => data.Value < 7);

    this.completedArr = Array.from(Array(this.labelData.length), () => false);
  }

  ngOnInit() {
    this._init();
  }

  private async _init() {
    await this._updateState();
    if (this.profileState == this.maxProfileState) {
      this.viewMode = ViewMode.Expansion;
    }
    switch (this.viewMode) {
      case ViewMode.Stepper:
        this.templateExpression = this.stepperTemp;
        break;
      case ViewMode.Tab:
        this.templateExpression = this.tabTemp;
        break;
      case ViewMode.Expansion:
        this.templateExpression = this.expansionTemp;
        break;
    }
  }
  ngAfterViewInit(): void {}
  selectStepperChange(e: StepperSelectionEvent) {
    this.selectedIndex = e.selectedIndex;
  }
  selectedTabChange(e: MatTabChangeEvent) {
    this.selectedIndex = e.index;
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
      this.model = await this._business.getModel(this.formId);
      console.log(this.model);
    }
    this.profileState = this.model ? this.model.ProfileState : 0;
    this.completedArr = this.completedArr.map((v, i) => {
      return i < this.profileState;
    });
    this._changeDetector.detectChanges();
  }
}
