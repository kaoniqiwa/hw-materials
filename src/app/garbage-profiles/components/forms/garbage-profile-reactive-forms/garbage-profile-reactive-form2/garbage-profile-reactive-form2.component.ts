import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormState } from 'src/app/enum/form-state.enum';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-source.tool';
import { PartialData } from 'src/app/network/entity/partial-data.interface';
import { Property } from 'src/app/network/entity/property.entity';
import { GarbageProfileReactiveForm2Business } from './garbage-profile-reactive-form2.business';

@Component({
  selector: 'garbage-profile-reactive-form2',
  templateUrl: './garbage-profile-reactive-form2.component.html',
  styleUrls: ['./garbage-profile-reactive-form2.component.less'],
  providers: [GarbageProfileReactiveForm2Business],
})
export class GarbageProfileReactiveForm2Component {
  @Input()
  formId?: string;

  @Input()
  formState: FormState = FormState.none;

  @Input() profileState = 0;

  @Input() maxProfileState = 6;

  @Output() close = new EventEmitter();
  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();

  FormState = FormState;
  properties: Property[] = [];
  partialData: PartialData | null = null;

  constructor(
    public sourceTool: GarbageStationProfilesSourceTools,
    public languageTool: GarbageStationProfilesLanguageTools,
    private _business: GarbageProfileReactiveForm2Business,
    private _toastrService: ToastrService
  ) {}
}
