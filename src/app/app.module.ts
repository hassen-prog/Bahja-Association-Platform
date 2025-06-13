import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './front-office/login/login.component';
import { PasswordResetRequestComponent } from './front-office/password-reset-request/password-reset-request.component';
import { PasswordResetComponent } from './front-office/password-reset/password-reset.component';
import { MyAppointmentsComponent } from './front-office/my-appointments/my-appointments.component';
import { CreateAppointmentComponent } from './front-office/create-appointment/create-appointment.component';
import { SignupComponent } from './front-office/signup/signup.component';
import { AuthGuard } from './_auth/auth.guard';
import { AuthInterceptor } from './_auth/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { DashboardComponent } from './back-office/dashboard/dashboard.component';
import { ListUsersComponent } from './back-office/list-users/list-users.component';
import { AddBookComponent } from './back-office/add-book/add-book.component';
import { AddRoleComponent } from './back-office/add-role/add-role.component';
import { AddVideoComponent } from './back-office/add-video/add-video.component';
import { RouterModule } from '@angular/router';
import { FrontOfficeModule } from './front-office/front-office.module';
import { CarouselModule } from '@coreui/angular';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PasswordResetRequestComponent,
    PasswordResetComponent,
    MyAppointmentsComponent,
    DashboardComponent,
    ListUsersComponent,
    AddBookComponent,
    AddRoleComponent,
    AddVideoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
    FrontOfficeModule,
    CarouselModule,
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
