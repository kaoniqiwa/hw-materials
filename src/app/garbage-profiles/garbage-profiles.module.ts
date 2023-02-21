import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HowellModule } from '../common/howell.module';
import { MaterialModule } from '../material.module';
import { GarbageProfilesLabelManagerComponent } from './components/garbage-profiles-label-manager/garbage-profiles-label-manager.component';
import { GarbageProfilesMaterialManagerComponent } from './components/garbage-profiles-material-manager/garbage-profiles-material-manager.component';
import { GarbageStationProfileDetailsComponent } from './components/garbage-station-profile-details/garbage-station-profile-details.component';
import { GarbageStationProfileManagerComponent } from './components/garbage-station-profile-manager/garbage-station-profile-manager.component';
import { SystemModeComponent } from './components/system-mode/system-mode.component';
import { TableComponents } from './components/tables/tables.module';
import { GarbageProfilesRoutingModule } from './garbage-profiles-routing.module';

@NgModule({
  declarations: [
    ...TableComponents,
    SystemModeComponent,
    GarbageStationProfileManagerComponent,
    GarbageStationProfileDetailsComponent,
    GarbageProfilesMaterialManagerComponent,
    GarbageProfilesLabelManagerComponent,
  ],
  imports: [
    GarbageProfilesRoutingModule,
    CommonModule,
    FormsModule,
    HowellModule,
    MaterialModule,
  ],
})
export class GarbageProfilesModule {}
