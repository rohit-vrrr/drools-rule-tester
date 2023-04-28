import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from './modules/primeng.module';
import { HcmNgModule } from 'hcm-angular';

import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { InputComponent } from 'hcm-angular';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimengModule,
    HcmNgModule,
    FormlyBootstrapModule,
    FormlyModule.forRoot({
      validationMessages: [{ name: 'required', message: 'This field is required' }],
      types: [
        { name: 'inputComponent', component: InputComponent}
      ]
    })
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    PrimengModule,
    HcmNgModule,
    FormlyBootstrapModule,
    FormlyModule
  ]
})
export class SharedModule {}
