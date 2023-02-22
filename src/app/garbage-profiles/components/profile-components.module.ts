import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HowellModule } from 'src/app/common/howell.module';
import { MaterialModule } from 'src/app/material.module';
import { GarbageProfilesLabelManagerComponent } from './garbage-profiles-label-manager/garbage-profiles-label-manager.component';
import { GarbageProfilesMaterialManagerComponent } from './garbage-profiles-material-manager/garbage-profiles-material-manager.component';
import { GarbageStationProfileDetailsComponent } from './garbage-station-profile-details/garbage-station-profile-details.component';
import { GarbageStationProfileManagerComponent } from './garbage-station-profile-manager/garbage-station-profile-manager.component';
import { MonitorPlatformComponent } from './monitor-platform/monitor-platform.component';
import { ProfileModeComponent } from './profile-mode/profile-mode.component';
import { SystemModeComponent } from './system-mode/system-mode.component';
import { TableComponents } from './tables';
import { UnderwaterComponent } from './underwater/underwater.component';

@NgModule({
  declarations: [
    ...TableComponents,
    MonitorPlatformComponent,
    SystemModeComponent,
    UnderwaterComponent,
    ProfileModeComponent,
    GarbageStationProfileManagerComponent,
    GarbageStationProfileDetailsComponent,
    GarbageProfilesMaterialManagerComponent,
    GarbageProfilesLabelManagerComponent,
  ],
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    HowellModule,
    RouterModule,
  ],
  exports: [],
})
export class ProfileComponentsModule {}
