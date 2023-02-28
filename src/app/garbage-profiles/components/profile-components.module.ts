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
import { GarbageProfilesMaterialRecordComponent } from './garbage-profiles-material-record/garbage-profiles-material-record.component';
import { GarbageStationProfileDetailsComponent } from './garbage-station-profile-details/garbage-station-profile-details.component';
import { GarbageStationProfileManagerComponent } from './garbage-station-profile-manager/garbage-station-profile-manager.component';
import { MaterialTreeComponent } from './material-tree/material-tree.component';
import { MonitorPlatformComponent } from './monitor-platform/monitor-platform.component';
import { StationArchiveComponent } from './station-archive/station-archive.component';
import { SystemModeComponent } from './system-mode/system-mode.component';
import { TableComponents } from './tables';
import { UnderwaterComponent } from './underwater/underwater.component';

@NgModule({
  declarations: [
    ...TableComponents,
    MonitorPlatformComponent,
    SystemModeComponent,
    UnderwaterComponent,
    StationArchiveComponent,
    GarbageStationProfileManagerComponent,
    GarbageStationProfileDetailsComponent,
    GarbageProfilesMaterialManagerComponent,
    GarbageProfilesMaterialDetailsComponent,
    GarbageProfilesMaterialRecordComponent,
    GarbageProfilesMaterialPutInComponent,
    GarbageProfilesLabelManagerComponent,
    GarbageProfilesLabelDetailsComponent,

    MaterialTreeComponent,
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