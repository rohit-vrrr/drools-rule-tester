import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from './modules/primeng.module';
import { HcmNgModule } from 'hcm-angular';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimengModule,
    HcmNgModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    PrimengModule,
    HcmNgModule
  ]
})
export class SharedModule {}
