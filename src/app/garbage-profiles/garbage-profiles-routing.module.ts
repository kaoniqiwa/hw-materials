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
                data: {
                  breadcrumb: '厢房档案',
                },
                children: [
                  {
                    path: 'profile-manager',
                    component: GarbageStationProfileManagerComponent,
                    data: {
                      breadcrumb: '厢房档案管理',
                    },
                  },

                  {
                    path: 'label-manager',
                    component: GarbageProfilesLabelManagerComponent,
                    data: {
                      breadcrumb: '厢房标签管理',
                    },
                  },
                ],
              },

              {
                path: 'material-manager',
                component: GarbageProfilesMaterialManagerComponent,
                data: {
                  breadcrumb: '物料档案',
                },
              },
              {
                path: 'label-manager',
                component: GarbageProfilesLabelManagerComponent,
              },
              {
                path: 'maintenance-profile-index',
                component: MaintenanceProfileIndexComponent,
                data: {
                  breadcrumb: '维修工档案',
                },
                children: [
                  {
                    path: 'profile-manager',
                    component: MaintenanceProfileManagerComponent,
                    data: {
                      breadcrumb: '维修工档案管理',
                    },
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
export class GarbageProfilesRoutingModule { }
