import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LandingComponent } from './landing/landing.component';
import { ParentViewComponent } from './parent-view/parent-view.component';
import { KidsViewComponent } from './kids-view/kids-view.component';
// import { CreateAppointmentComponent } from './create-appointment/create-appointment.component';
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
import { ColoringPageComponent } from './coloring-page/coloring-page.component';
import { CarouselModule } from '@coreui/angular';
import { PptxViewerComponent } from '../front-office/shared/components/pptx-viewer/pptx-viewer.component';
import { SafeUrlPipe } from '../front-office/shared/pipes/safe-url.pipe';
import { IconModule } from '@coreui/icons-angular';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarComponent } from './calendar/calendar.component';
import { JoinInterestDialogComponent } from './join-interest-dialog/join-interest-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

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
    // CreateAppointmentComponent,
    BooksComponent,
    ChatComponent,
    CoursesComponent,
    ColoringPageComponent,
    CourseDetailComponent,
    CalendarComponent,
    JoinInterestDialogComponent,
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
    CarouselModule,
    IconModule,
    PptxViewerComponent,
    SafeUrlPipe,
    FullCalendarModule,
    MatDialogModule,
  ],
})
export class FrontOfficeModule {}
