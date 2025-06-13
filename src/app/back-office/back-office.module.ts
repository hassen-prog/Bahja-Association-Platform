import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackOfficeRoutingModule } from './back-office-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppointmentsBackComponent } from './appointments-back/appointments-back.component';
import { AddVideoComponent } from './add-video/add-video.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { AdminChatComponent } from './admin-chat/admin-chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
   AppointmentsBackComponent,
   AdminChatComponent
  ],
  imports: [
    CommonModule,
    BackOfficeRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BackOfficeModule { }
