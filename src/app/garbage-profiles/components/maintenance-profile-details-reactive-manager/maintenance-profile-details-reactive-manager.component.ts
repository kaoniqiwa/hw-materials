import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  ChangeDetectorRef,
  Component,
  Input,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatStepper } from '@angular/material/stepper';
import { MatTabGroup, MatTabChangeEvent } from '@angular/material/tabs';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';
import { FormState } from 'src/app/enum/form-state.enum';
import { ViewMode } from 'src/app/enum/view-mode.enum';
import { MaintenanceProfile } from 'src/app/network/entity/maintenance-profile.entity';
import { ValueNamePair } from 'src/app/network/entity/value-name-pair.entity';
import { MaintenanceProfilesSourceTools } from '../../tools/maintenance-profile-source.tool';
import { MaintenanceProfileDetailsReactiveManagerBusiness } from './maintenance-profile-details-reactive-manager.business';

@Component({
  selector: 'maintenance-profile-details-reactive-manager',
  templateUrl: './maintenance-profile-details-reactive-manager.component.html',
  styleUrls: ['./maintenance-profile-details-reactive-manager.component.less'],
  providers: [MaintenanceProfileDetailsReactiveManagerBusiness],
})
export class MaintenanceProfileDetailsReactiveManagerComponent {
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
  maxProfileState = 5;
  labelData: Array<ValueNamePair> = this.sourceTool['ProfileState'];
  completedArr: boolean[] = [];
  model: MaintenanceProfile | null = null;
  templateExpression: TemplateRef<any> | null = null;
  templateController: MatStepper | MatTabGroup | null = null;
  getTemplate(index: number) {
    return this.stepList ? this.stepList.get(index) ?? null : null;
  }
  constructor(
    private _business: MaintenanceProfileDetailsReactiveManagerBusiness,
    private sourceTool: MaintenanceProfilesSourceTools,
    private _changeDetector: ChangeDetectorRef,
    private local: LocalStorageService
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
    if (this.profileState == this.maxProfileState) {
      this.viewMode = ViewMode.Expansion;
    }
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
