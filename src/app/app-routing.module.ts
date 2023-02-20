import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthorizationService } from './network/request/auth/auth-request.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'garbage-profiles',
    loadChildren: () =>
      import('./garbage-profiles/garbage-profiles.module').then(
        (mod) => mod.GarbageProfilesModule
      ),
    canActivate: [AuthorizationService],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
