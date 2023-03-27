import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatStepper } from '@angular/material/stepper';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { FormState } from 'src/app/enum/form-state.enum';
import { ViewMode } from 'src/app/enum/view-mode.enum';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { ValueNamePair } from 'src/app/network/entity/value-name-pair.entity';
import { GarbageStationProfilesSourceTools } from '../../tools/garbage-station-profile-source.tool';
import { GarbageProfileDetailsReactiveManagerBusiness } from './garbage-profile-details-reactive-manager.business';

@Component({
  selector: 'garbage-profile-details-reactive-manager',
  templateUrl: './garbage-profile-details-reactive-manager.component.html',
  styleUrls: ['./garbage-profile-details-reactive-manager.component.less'],
  providers: [GarbageProfileDetailsReactiveManagerBusiness],
})
export class GarbageProfileDetailsReactiveManagerComponent implements OnInit {
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
  @ViewChild('stepperTemp', { static: true }) stepperTemp!: TemplateRef<any>;
  @ViewChild('tabTemp', { static: true }) tabTemp!: TemplateRef<any>;
  @ViewChild('expansionTemp', { static: true })
  expansionTemp!: TemplateRef<any>;
  @ViewChildren('step') stepList?: QueryList<TemplateRef<any>>;
  @ViewChild(MatStepper) matStepper!: MatStepper;
  @ViewChild(MatTabGroup) matTabGroup!: MatTabGroup;
  @ViewChild(MatAccordion) matAccordion!: MatAccordion;

  viewMode = ViewMode.Stepper;
  profileState = 0;
  maxProfileState = 6;
  labelData: Array<ValueNamePair> = this.sourceTool['ProfileState'];
  completedArr: boolean[] = [];
  model: GarbageStationProfile | null = null;
  templateExpression: TemplateRef<any> | null = null;
  templateController: MatStepper | MatTabGroup | null = null;
  getTemplate(index: number) {
    return this.stepList ? this.stepList.get(index) ?? null : null;
  }

  constructor(
    private sourceTool: GarbageStationProfilesSourceTools,
    private _changeDetector: ChangeDetectorRef,
    private _business: GarbageProfileDetailsReactiveManagerBusiness
  ) {
    this.labelData = this.labelData.filter(
      (data) => data.Value <= this.maxProfileState
    );
    this.completedArr = Array.from(Array(this.labelData.length), () => false);
  }
  ngOnInit(): void {
    this._init();
  }
  private async _init() {
    await this._updateState();
    // if (this.profileState == this.maxProfileState) {
    //   this.viewMode = ViewMode.Expansion;
    // }
    switch (this.viewMode) {
      case ViewMode.Stepper:
        this.templateExpression = this.stepperTemp;
        this.templateController = this.matStepper;
        break;
      case ViewMode.Tab:
        this.templateExpression = this.tabTemp;
        break;
      case ViewMode.Expansion:
        this.templateExpression = this.expansionTemp;
        break;
    }
  }
  selectStepperChange(e: StepperSelectionEvent) {
    this.selectedIndex = e.selectedIndex;
  }
  selectedTabChange(e: MatTabChangeEvent) {
    this.selectedIndex = e.index;
  }
  opened(index: number) {
    this.selectedIndex = index;
  }
  nextEvent() {
    this.selectedIndex = Math.min(
      this.selectedIndex + 1,
      this.maxProfileState - 1
    );
  }
  closeEvent() {}
  previousEvent() {}
  private async _updateState() {
    if (this.formId) {
      this.model = await this._business.getModel(this.formId);
      console.log('Model:', this.model);
    }
    this.profileState = this.model ? this.model.ProfileState : 0;
    this.completedArr = this.completedArr.map((v, i) => {
      return i < this.profileState;
    });
    this._changeDetector.detectChanges();
  }
}
