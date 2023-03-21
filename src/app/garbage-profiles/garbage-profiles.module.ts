import { NgModule } from '@angular/core';
import { ProfileComponentsModule } from './components/profile-components.module';
import { GarbageProfilesRoutingModule } from './garbage-profiles-routing.module';

@NgModule({
  declarations: [],
  imports: [GarbageProfilesRoutingModule, ProfileComponentsModule],
})
export class GarbageProfilesModule {}
