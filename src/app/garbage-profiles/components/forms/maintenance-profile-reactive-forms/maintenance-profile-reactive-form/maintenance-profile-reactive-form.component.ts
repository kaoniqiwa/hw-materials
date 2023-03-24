import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MaintenanceProfilesLanguageTools } from 'src/app/garbage-profiles/tools/maintenance-profile-language.too';
import { MaintenanceProfilesSourceTools } from 'src/app/garbage-profiles/tools/maintenance-profile-source.tool';
import { PartialData } from 'src/app/network/entity/partial-data.interface';
import { Property } from 'src/app/network/entity/property.entity';
import { MaintenanceProfileReactiveFormBusiness } from './maintenance-profile-reactive-form.business';

@Directive({
  selector: 'maintenance-profile-reactive-form',
})
export class MaintenanceProfileReactiveFormDirective {
  @Input()
  formId?: string;

  @Output() close = new EventEmitter();
  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();

  protected profileState = 0;
  protected formGroup: FormGroup = new FormGroup({});
  protected properties: Property[] = [];
  protected partialData: PartialData | null = null;

  constructor(
    protected _business: MaintenanceProfileReactiveFormBusiness,
    protected _toastrService: ToastrService,
    protected sourceTool: MaintenanceProfilesSourceTools,
    protected languageTool: MaintenanceProfilesLanguageTools
  ) {}

  clickCreate() {
    this.close.emit();
  }
  clickPrev() {
    this.previous.emit();
  }
  clickSave() {
    // this.close.emit();
    console.log(this.formGroup.value);
  }
  clickNext() {
    this.next.emit();
  }
}
