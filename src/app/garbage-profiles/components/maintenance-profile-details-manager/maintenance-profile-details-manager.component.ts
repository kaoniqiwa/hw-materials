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
  @Input() formId?: string;

  @Input() formState = FormState.none;

  @ViewChild('stepperTemp') stepperTemp?: TemplateRef<any>;
  @ViewChild('tabTemp') tabTemp?: TemplateRef<any>;
  @ViewChild('expansionTemp') expansionTemp?: TemplateRef<any>;
  @ViewChildren('step') stepList?: QueryList<TemplateRef<any>>;
  @ViewChild(MatStepper) matStepper?: MatStepper;

  getTemplate(index: number) {
    return this.stepList ? this.stepList.get(index) ?? null : null;
  }

  templateExpression: TemplateRef<any> | null = null;

  model: MaintenanceProfile | null = null;
  labelData: Array<ValueNamePair> = this.sourceTool['ProfileState'];
  stepLength = this.labelData.length;

  constructor(
    private _business: MaintenanceProfileDetailsManagerBusiness,
    private sourceTool: MaintenanceProfilesSourceTools,
    private _changeDetector: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    console.log(this.sourceTool['ProfileState']);
    this._init();
  }
  private async _init() {
    if (this.formId) {
      this.model = await this._business.getModel(this.formId);
      console.log('model', this.model);
    }
  }
  ngAfterViewInit(): void {
    // if (this.stepperTemp) {
    //   this.templateExpression = this.stepperTemp;
    // }

    if (this.tabTemp) {
      this.templateExpression = this.tabTemp;
    }

    this._changeDetector.detectChanges();
  }

  selectedTabChange(e: MatTabChangeEvent) {
    console.log(e);
  }
}
