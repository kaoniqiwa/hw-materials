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
import { MatStepper } from '@angular/material/stepper';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FormState } from 'src/app/enum/form-state.enum';
import { ViewMode } from 'src/app/enum/view-mode.enum';
import { MaintenanceProfile } from 'src/app/network/entity/maintenance-profile.entity';
import { ValueNamePair } from 'src/app/network/entity/value-name-pair.entity';
import { MaintenanceProfilesSourceTools } from '../../tools/maintenance-profile-source.tool';
import { MaintenanceProfileDetailsManagerBusiness } from './maintenance-profile-details-manager.business';

@Component({
  selector: 'maintenance-profile-details-manager',
  templateUrl: './maintenance-profile-details-manager.component.html',
  styleUrls: ['./maintenance-profile-details-manager.component.less'],
  providers: [MaintenanceProfileDetailsManagerBusiness],
})
export class MaintenanceProfileDetailsManagerComponent
  implements OnInit, AfterViewInit
{
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
  @ViewChild(MatStepper) matStepper!: MatStepper;
  @ViewChildren('step') stepList?: QueryList<TemplateRef<any>>;

  profileState = 0;
  maxProfileState = 5;
  labelData: Array<ValueNamePair> = this.sourceTool['ProfileState'];

  completedArr: boolean[] = [];

  model: MaintenanceProfile | null = null;
  templateExpression: TemplateRef<any> | null = null;
  viewMode = ViewMode.Tab;

  getTemplate(index: number) {
    return this.stepList ? this.stepList.get(index) ?? null : null;
  }

  constructor(
    private _business: MaintenanceProfileDetailsManagerBusiness,
    private sourceTool: MaintenanceProfilesSourceTools,
    private _changeDetector: ChangeDetectorRef
  ) {
    this.labelData = this.labelData.filter(
      (data) => data.Value <= this.maxProfileState
    );
    this.completedArr = Array.from(Array(this.labelData.length), () => false);
  }
  ngOnInit(): void {
    this._init();
  }
  ngAfterViewInit(): void {}

  private async _init() {
    await this._updateState();
    // if (this.profileState == this.maxProfileState) {
    //   this.viewMode = ViewMode.Expansion;
    // }
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

  selectStepperChange(e: StepperSelectionEvent) {
    this.selectedIndex = e.selectedIndex;
  }
  selectedTabChange(e: MatTabChangeEvent) {
    this.selectedIndex = e.index;
  }
  opened(index: number) {
    this.selectedIndex = index;
  }
  private async _updateState() {
    if (this.formId) {
      this.model = await this._business.getModel(this.formId);
      console.log('updateState', this.model);
    }
    this.profileState = this.model ? this.model.ProfileState : 0;
    this.completedArr = this.completedArr.map((v, i) => {
      return i < this.profileState;
    });
    this._changeDetector.detectChanges();
  }
}
