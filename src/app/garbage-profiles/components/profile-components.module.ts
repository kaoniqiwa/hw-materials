import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HowellModule } from 'src/app/common/howell.module';
import { MaterialModule } from 'src/app/material.module';
import { GarbageProfilesLabelDetailsComponent } from './garbage-profiles-label-details/garbage-profiles-label-details.component';
import { GarbageProfilesLabelManagerComponent } from './garbage-profiles-label-manager/garbage-profiles-label-manager.component';
import { GarbageProfilesMaterialDetailsComponent } from './garbage-profiles-material-details/garbage-profiles-material-details.component';
import { GarbageProfilesMaterialManagerComponent } from './garbage-profiles-material-manager/garbage-profiles-material-manager.component';
import { GarbageProfilesMaterialPutInComponent } from './garbage-profiles-material-putin/garbage-profiles-material-putin.component';
import { GarbageProfilesMaterialPutoutComponent } from './garbage-profiles-material-putout/garbage-profiles-material-putout.component';
import { GarbageProfilesMaterialRecordDetailsComponent } from './garbage-profiles-material-record-details/garbage-profiles-material-record-details.component';
import { GarbageProfilesMaterialRecordComponent } from './garbage-profiles-material-record/garbage-profiles-material-record.component';
import { GarbageStationProfileDetailsComponent } from './garbage-station-profile-details/garbage-station-profile-details.component';
import { GarbageStationProfileManagerComponent } from './garbage-station-profile-manager/garbage-station-profile-manager.component';
import { GarbageStationProfilePartialDataComponent } from './garbage-station-profile-partial-data/garbage-station-profile-partial-data.component';
import { GarbageStationProfileRecordComponent } from './garbage-station-profile-record/garbage-station-profile-record.component';
import { GarbageStationProfileSettingComponent } from './garbage-station-profile-setting/garbage-station-profile-setting.component';
import { HowellPictureControlComponent } from './howell-picture-control/howell-picture-control.component';
import { HowellPictureUploadControlComponent } from './howell-picture-upload-control/howell-picture-upload-control.component';
import { MonitorPlatformComponent } from './monitor-platform/monitor-platform.component';
import { StationArchiveComponent } from './station-archive/station-archive.component';
import { SystemModeComponent } from './system-mode/system-mode.component';
import { TableComponents } from './tables/tables';
import { TreeComponents } from './trees/trees';
import { UnderwaterComponent } from './underwater/underwater.component';

@NgModule({
  declarations: [
    ...TableComponents,
    ...TreeComponents,
    MonitorPlatformComponent,
    SystemModeComponent,
    UnderwaterComponent,
    StationArchiveComponent,

    GarbageStationProfileManagerComponent,
    GarbageStationProfileSettingComponent,
    GarbageStationProfileDetailsComponent,
    GarbageStationProfileRecordComponent,
    GarbageStationProfilePartialDataComponent,

    GarbageProfilesMaterialManagerComponent,
    GarbageProfilesMaterialDetailsComponent,
    GarbageProfilesMaterialRecordComponent,
    GarbageProfilesMaterialRecordDetailsComponent,
    GarbageProfilesMaterialPutInComponent,
    GarbageProfilesMaterialPutoutComponent,

    GarbageProfilesLabelManagerComponent,
    GarbageProfilesLabelDetailsComponent,

    HowellPictureControlComponent,
    HowellPictureUploadControlComponent,
  ],
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    HowellModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  exports: [],
})
export class ProfileComponentsModule {}
