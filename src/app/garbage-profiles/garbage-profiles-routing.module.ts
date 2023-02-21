import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GarbageProfilesLabelManagerComponent } from './components/garbage-profiles-label-manager/garbage-profiles-label-manager.component';
import { GarbageProfilesMaterialManagerComponent } from './components/garbage-profiles-material-manager/garbage-profiles-material-manager.component';
import { GarbageStationProfileManagerComponent } from './components/garbage-station-profile-manager/garbage-station-profile-manager.component';
import { ProfileIndexComponent } from './components/profile-index/profile-index.component';
import { ProfileModeComponent } from './components/profile-mode/profile-mode.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'profile-index',
    pathMatch: 'full',
  },
  {
    path: 'profile-index',
    component: ProfileIndexComponent,
    children: [
      {
        path: '',
        redirectTo: 'profile-mode',
        pathMatch: 'full',
      },
      {
        path: 'profile-mode',
        component: ProfileModeComponent,
        children: [
          {
            path: '',
            redirectTo: 'profile-manager',
            pathMatch: 'full',
          },
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
    ],
  },
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GarbageProfilesRoutingModule {}
