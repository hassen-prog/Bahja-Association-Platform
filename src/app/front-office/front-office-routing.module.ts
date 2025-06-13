import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { PasswordResetRequestComponent } from './password-reset-request/password-reset-request.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ParentViewComponent } from './parent-view/parent-view.component';
import { CreateAppointmentComponent } from './create-appointment/create-appointment.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardFrontComponent } from './dashboard-front/dashboard-front.component';
import { VideoListComponent } from './video-list/video-list.component';
import { KidsViewComponent } from './kids-view/kids-view.component';
import { BooksComponent } from './books/books.component';
import { ChatComponent } from './chat/chat.component';
import { ForumListComponent } from './forum/forum-list/forum-list.component';
import { ForumTopicComponent } from './forum/forum-topic/forum-topic.component';
import { CreateTopicComponent } from './forum/create-topic/create-topic.component';
import { CreatePostComponent } from './forum/create-post/create-post.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { CoursesComponent } from './courses/courses.component';
import { CommonModule } from '@angular/common';
import { ForumPostComponent } from './forum/forum-post/forum-post.component';
import { BookDetailComponent } from './book-detail/book-detail.component';

const routes: Routes = [
  {
    path: 'dashboardF',
    component: DashboardFrontComponent,
    children: [
      { path: 'newapp', component: CreateAppointmentComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'parent', component: ParentViewComponent },
      { path: 'kid', component: KidsViewComponent },
      { path: 'videos', component: VideoListComponent },
      { path: 'books', component: BooksComponent },
      { path: 'bookDetail/:id', component: BookDetailComponent },
      { path: 'chat', component: ChatComponent },
      // Forum routes
      { path: 'forum', component: ForumListComponent },
      { path: 'forum/topic/:id', component: ForumTopicComponent },
      { path: 'forum/create-topic', component: CreateTopicComponent },
      { path: 'forum/create-post', component: CreatePostComponent },
      { path: '', redirectTo: 'dashboardF', pathMatch: 'full' },
      { path: 'courses', component: CoursesComponent },
      {
        path: 'courses/:id',
        component: CourseDetailComponent,
        // Add course access guard
      },
      {
        path: 'post/:id',
        component: ForumPostComponent,
      },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'requestPasswordReset', component: PasswordResetRequestComponent },
  { path: 'resetPassword', component: PasswordResetComponent },
  { path: 'resetPassword/:resToken', component: PasswordResetComponent },
  // { path: 'book/:id', component: BooksComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],

  // declarations: [CoursesComponent],
})
export class FrontOfficeRoutingModule {}
