import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { PIPE_Modules } from '../pipes/pipe.module';
import { TableComponents } from './components/tables/tables.module';
import { GarbageProfilesRoutingModule } from './garbage-profiles-routing.module';

@NgModule({
  declarations: [...TableComponents, ...PIPE_Modules],
  imports: [
    GarbageProfilesRoutingModule,
    BrowserModule,
    CommonModule,
    FormsModule,
  ],
})
export class GarbageProfilesModule {}
