import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GarbageStationProfileDetailsComponent } from './components/garbage-station-profile-details/garbage-station-profile-details.component';
import { GarbageStationProfileManagerComponent } from './components/garbage-station-profile-manager/garbage-station-profile-manager.component';
import { SystemModeComponent } from './components/system-mode/system-mode.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'system-mode',
    pathMatch: 'full',
  },
  {
    path: 'system-mode',
    component: SystemModeComponent,
    children: [
      {
        path: '',
        redirectTo: 'station-profiles',
        pathMatch: 'full',
      },
      {
        path: 'station-profiles',
        children: [
          {
            path: '',
            redirectTo: 'station-manager',
            pathMatch: 'full',
          },
          {
            path: 'station-manager',
            component: GarbageStationProfileManagerComponent,
          },
          {
            path: 'material-manager',
            component: GarbageStationProfileDetailsComponent,
          },
        ],
      },
    ],
  },
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GarbageProfilesRoutingModule {}
