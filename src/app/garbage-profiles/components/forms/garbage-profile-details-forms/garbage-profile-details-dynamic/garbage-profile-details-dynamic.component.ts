import { FormatWidth } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastRef, ToastrService } from 'ngx-toastr';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/source.tool';

@Component({
  selector: 'garbage-profile-details-dynamic',
  templateUrl: './garbage-profile-details-dynamic.component.html',
  styleUrls: ['./garbage-profile-details-dynamic.component.less'],
})
export class GarbageProfileDetailsDynamicComponent implements OnInit {
  @Input()
  formId?: string;

  currentIndex = 0;
  maxLength = 7;
  formGroup = new FormGroup({
    Cameras: new FormArray([]),
  });

  get Cameras() {
    return this.formGroup.get('Cameras') as FormArray;
  }

  constructor(
    public source: GarbageStationProfilesSourceTools,
    public language: GarbageStationProfilesLanguageTools,
    private _toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    console.log(this.formId);
    this.addCamera();
  }
  newCamera() {
    return new FormGroup({
      Name: new FormControl('', Validators.required),
      Model: new FormControl(1, Validators.required),
      SerialNo: new FormControl('', Validators.required),
      Placement: new FormControl(1, Validators.required),
    });
  }
  addCamera() {
    if (this.Cameras.length < this.maxLength)
      this.Cameras.push(this.newCamera());
  }
  deleteCamera(index: number, e: Event) {
    e.stopPropagation();
    if (index == this.Cameras.length - 1) {
      this.Cameras.removeAt(index);
      if (this.currentIndex == index) {
        this.currentIndex = index - 1;
      }
    } else {
      this._toastrService.warning('请依次删除');
    }
  }
}
