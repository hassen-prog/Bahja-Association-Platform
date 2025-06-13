import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LandingComponent } from './landing/landing.component';
import { ParentViewComponent } from './parent-view/parent-view.component';
import { KidsViewComponent } from './kids-view/kids-view.component';
import { CreateAppointmentComponent } from './create-appointment/create-appointment.component';
import { MyAppointmentsComponent } from './my-appointments/my-appointments.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProfileComponent } from './profile/profile.component';
import { DashboardFrontComponent } from './dashboard-front/dashboard-front.component';
import { VideoListComponent } from './video-list/video-list.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { AppModule } from '../app.module';
import { BooksComponent } from './books/books.component';
import { ChatComponent } from './chat/chat.component';
import { ForumModule } from './forum/forum.module';
import { RouterModule } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { BookReaderComponent } from './book-reader/book-reader.component';
@NgModule({
  declarations: [
    SignupComponent,
    LandingComponent,
    ParentViewComponent,
    KidsViewComponent,
    BookDetailComponent,
    BookReaderComponent,
    ProfileComponent,
    DashboardFrontComponent,
    VideoListComponent,
    NavbarComponent,
    FooterComponent,
    CreateAppointmentComponent,
    BooksComponent,
    ChatComponent,
    CoursesComponent,
  ],
  imports: [
    CommonModule,
    FrontOfficeRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    YouTubePlayerModule,
    ForumModule,
    RouterModule,
  ],
})
export class FrontOfficeModule {}
