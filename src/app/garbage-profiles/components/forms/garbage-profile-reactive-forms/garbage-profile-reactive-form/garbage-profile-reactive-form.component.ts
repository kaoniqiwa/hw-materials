import {
  Component,
  Directive,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-source.tool';
import { PartialData } from 'src/app/network/entity/partial-data.interface';
import { Property } from 'src/app/network/entity/property.entity';
import { GarbageProfileReactiveFormBusiness } from './garbage-profile-reactive-form.business';

@Directive({
  selector: 'garbage-profile-reactive-form',
})
export class GarbageProfileReactiveForm {
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
    protected _business: GarbageProfileReactiveFormBusiness,
    protected _toastrService: ToastrService,
    protected sourceTool: GarbageStationProfilesSourceTools,
    protected languageTool: GarbageStationProfilesLanguageTools
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
