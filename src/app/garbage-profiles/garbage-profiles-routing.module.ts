import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
        // children: [
        //   {
        //     path: '',
        //     redirectTo: 'station-manager',
        //     pathMatch: 'full',
        //   },
        //   {
        //     path: 'station-manager',
        //     component: GarbageStationProfileManagerComponent,
        //   },
        //   {
        //     path: 'material-manager',
        //     component: GarbageProfilesMaterialManagerComponent,
        //   },
        // ],
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
