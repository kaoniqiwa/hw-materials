/*
 * @Author: pmx
 * @Date: 2021-09-26 14:26:27
 * @Last Modified by: pmx
 * @Last Modified time: 2022-11-08 13:34:19
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';
import { CUSTOM_COMPONENTS } from './components';
import { CUSTOM_PIPES } from './pipes';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularResizeEventModule } from 'angular-resize-event';
import { CUSTOM_DIRECTIVES } from './directives';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [...CUSTOM_COMPONENTS, ...CUSTOM_PIPES, ...CUSTOM_DIRECTIVES],
  exports: [...CUSTOM_COMPONENTS, ...CUSTOM_PIPES, ...CUSTOM_DIRECTIVES],
  imports: [
    CommonModule,
    MaterialModule,
    AngularResizeEventModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class HowellModule {}
