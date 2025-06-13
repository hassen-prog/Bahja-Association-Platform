import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';

import { ForumListComponent } from './forum-list/forum-list.component';
import { ForumTopicComponent } from './forum-topic/forum-topic.component';
import { CreateTopicComponent } from './create-topic/create-topic.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { ForumSearchComponent } from './forum-search/forum-search.component';
import { ForumService } from 'src/app/_services/forum.service';
import { ForumPostComponent } from './forum-post/forum-post.component';

@NgModule({
  declarations: [
    ForumListComponent,
    ForumTopicComponent,
    CreateTopicComponent,
    CreatePostComponent,
    ForumSearchComponent,
    ForumPostComponent,
 

  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
  ],
  providers: [
    ForumService
  ],
  exports: [
    ForumListComponent,
    ForumTopicComponent,
    CreateTopicComponent,
    CreatePostComponent,
    ForumSearchComponent
  ]
})
export class ForumModule { } 