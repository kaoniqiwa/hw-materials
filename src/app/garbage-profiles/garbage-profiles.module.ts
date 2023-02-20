import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HowellModule } from '../common/howell.module';
import { MaterialModule } from '../material.module';
import { TableComponents } from './components/tables/tables.module';
import { GarbageProfilesRoutingModule } from './garbage-profiles-routing.module';

@NgModule({
  declarations: [...TableComponents],
  imports: [
    GarbageProfilesRoutingModule,
    CommonModule,
    FormsModule,
    HowellModule,
    MaterialModule,
  ],
})
export class GarbageProfilesModule {}
