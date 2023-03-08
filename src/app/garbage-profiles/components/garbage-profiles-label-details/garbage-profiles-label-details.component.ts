import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormState } from 'src/app/enum/form-state.enum';
import { LabelModel } from 'src/app/model/label.model';
import { GarbageProfilesLabelDetailsBusiness } from './garbage-profiles-label-details.business';

@Component({
  selector: 'garbage-profiles-label-details',
  templateUrl: './garbage-profiles-label-details.component.html',
  styleUrls: ['./garbage-profiles-label-details.component.less'],
  providers: [GarbageProfilesLabelDetailsBusiness],
})
export class GarbageProfilesLabelDetailsComponent {
  @Input()
  model?: LabelModel;
  @Output()
  ok: EventEmitter<LabelModel> = new EventEmitter();
  @Output()
  cancel: EventEmitter<void> = new EventEmitter();
  @Input()
  state: FormState = FormState.none;

  constructor(private business: GarbageProfilesLabelDetailsBusiness) {}

  FormState = FormState;

  onok() {
    if (this.model) {
      switch (this.state) {
        case FormState.add:
          this.business.create(this.model).then((x) => {
            this.ok.emit(x);
          });
          break;
        case FormState.edit:
          this.business.update(this.model).then((x) => {
            this.ok.emit();
          });
          break;
        default:
          break;
      }
    }
  }
  oncancel() {
    this.cancel.emit();
  }
}
