import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GarbageProfilesLabelManagerComponent } from './components/garbage-profiles-label-manager/garbage-profiles-label-manager.component';
import { GarbageProfilesMaterialManagerComponent } from './components/garbage-profiles-material-manager/garbage-profiles-material-manager.component';
import { GarbageStationProfileManagerComponent } from './components/garbage-station-profile-manager/garbage-station-profile-manager.component';
import { UnderwaterComponent } from './components/underwater/underwater.component';
import { StationArchiveComponent } from './components/station-archive/station-archive.component';
import { SystemModeComponent } from './components/system-mode/system-mode.component';
import { MonitorPlatformComponent } from './components/monitor-platform/monitor-platform.component';

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
                path: 'profile-manager',
                component: GarbageStationProfileManagerComponent,
              },
              {
                path: 'material-manager',
                component: GarbageProfilesMaterialManagerComponent,
              },
              {
                path: 'label-manager',
                component: GarbageProfilesLabelManagerComponent,
              },
            ],
          },
          {
            path: 'garbage-classify',
            children: [
              {
                path: '',
                redirectTo: 'division-manage',
                pathMatch: 'full',
              },
              {
                path: 'division-manage',
                component: GarbageStationProfileManagerComponent,
              },
              {
                path: 'deploy-map',
                component: GarbageProfilesMaterialManagerComponent,
              },
              {
                path: 'garbage-station-manage',
                component: GarbageProfilesLabelManagerComponent,
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
