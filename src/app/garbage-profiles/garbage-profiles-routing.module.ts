import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GarbageProfilesLabelManagerComponent } from './components/garbage-profiles-label-manager/garbage-profiles-label-manager.component';
import { GarbageProfilesMaterialManagerComponent } from './components/garbage-profiles-material-manager/garbage-profiles-material-manager.component';
import { GarbageStationProfileIndexComponent } from './components/garbage-station-profile-index/garbage-station-profile-index.component';
import { GarbageStationProfileManagerComponent } from './components/garbage-station-profile-manager/garbage-station-profile-manager.component';
import { MaintenanceProfileIndexComponent } from './components/maintenance-profile-index/maintenance-profile-index.component';
import { MaintenanceProfileManagerComponent } from './components/maintenance-profile-manager/maintenance-profile-manager.component';
import { MonitorPlatformComponent } from './components/monitor-platform/monitor-platform.component';
import { StationArchiveComponent } from './components/station-archive/station-archive.component';
import { SystemModeComponent } from './components/system-mode/system-mode.component';
import { UnderwaterComponent } from './components/underwater/underwater.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'underwater',
    pathMatch: 'full',
  },
  {
    path: 'system-mode',
    component: SystemModeComponent,
  },
  {
    path: 'underwater',
    component: UnderwaterComponent,
    children: [
      {
        path: '',
        redirectTo: 'monitor-platform',
        pathMatch: 'full',
      },
      {
        path: 'monitor-platform',
        component: MonitorPlatformComponent,
        children: [
          {
            path: '',
            redirectTo: 'station-archive',
            pathMatch: 'full',
          },
          {
            path: 'station-archive',
            component: StationArchiveComponent,

            children: [
              {
                path: '',
                redirectTo: 'station-profile-index',
                pathMatch: 'full',
              },
              {
                path: 'station-profile-index',
                component: GarbageStationProfileIndexComponent,

                children: [
                  {
                    path: 'profile-manager',
                    component: GarbageStationProfileManagerComponent,
                  },

                  {
                    path: 'label-manager',
                    component: GarbageProfilesLabelManagerComponent,
                  },
                ],
              },

              {
                path: 'material-manager',
                component: GarbageProfilesMaterialManagerComponent,
              },
              {
                path: 'label-manager',
                component: GarbageProfilesLabelManagerComponent,
              },
              {
                path: 'maintenance-profile-index',
                component: MaintenanceProfileIndexComponent,

                children: [
                  {
                    path: 'profile-manager',
                    component: MaintenanceProfileManagerComponent,
                  },
                ],
              },
            ],
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
