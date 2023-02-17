import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
  },
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
})
export class GarbageProfilesRoutingModule {}
