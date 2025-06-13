import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUsersComponent } from './list-users/list-users.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddBookComponent } from './add-book/add-book.component';
import { AppointmentsBackComponent } from './appointments-back/appointments-back.component';
import { AddVideoComponent } from './add-video/add-video.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { AdminChatComponent } from './admin-chat/admin-chat.component';

const routes: Routes = [
  
    {
      path: '', 
      component: DashboardComponent, 
      children: [
        { path: 'list-users', component: ListUsersComponent }, 
        { path: 'add-book', component: AddBookComponent },
        { path: 'appointments', component: AppointmentsBackComponent },
        { path: 'add-book', component: AddBookComponent },
        { path: 'add-video', component: AddVideoComponent },
        { path: 'add-role', component: AddRoleComponent },
        { path: 'chat', component: AdminChatComponent },
 {
        path: 'courses',
        loadComponent: () =>
          import('./course-management/course-management.component').then((m) => m.CourseManagementComponent)
      },
      // Category management component
      {
        path: 'categories',
        loadComponent: () =>
          import('./category-management/category-management.component').then((m) => m.CategoryManagementComponent)
      },




        { path: '', redirectTo: 'list-users', pathMatch: 'full' }, 
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackOfficeRoutingModule { }
