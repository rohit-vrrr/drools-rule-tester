import { NgModule } from '@angular/core';

import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from "primeng/divider";
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from "primeng/inputtext";
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from "primeng/password";
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

@NgModule({
  exports: [
    AccordionModule,
    ButtonModule,
    DividerModule,
    DropdownModule,
    InputTextModule,
    MenubarModule,
    MessagesModule,
    MessageModule,
    PasswordModule,
    RippleModule,
    SidebarModule,
    SkeletonModule,
    TableModule
  ]
})
export class PrimengModule {}
