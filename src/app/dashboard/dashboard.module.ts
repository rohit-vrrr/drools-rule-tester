import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard/dashboard.component';
import { MainPipeModule } from '../main-pipe/main-pipe.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, MainPipeModule, SharedModule],
  exports: [DashboardComponent]
})
export class DashboardModule { }
