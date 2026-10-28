import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ForumTopic } from 'src/app/_model/forum.model';
import { ForumService } from 'src/app/_services/forum.service';
import { UserAuthService } from 'src/app/_services/user-auth.service';

@Component({
  selector: 'app-forum-list',
  templateUrl: './forum-list.component.html',
  styleUrls: ['./forum-list.component.scss']
})
export class ForumListComponent implements OnInit {
  topics: ForumTopic[] = [];
  loading = false;
  error = '';
  username: string = '';

  constructor(
    private forumService: ForumService,
    public authService: UserAuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.loadTopics();
  }

  loadTopics(): void {
    this.loading = true;
    this.forumService.getAllTopics().subscribe(
      (data) => {
        this.topics = data;
        this.loading = false;
      },
      (error) => {
        this.error = 'Failed to load topics';
        console.error('Error fetching topics:', error);
        this.loading = false;
      }
    );
  }

  navigateToTopic(topicId: number): void {
    this.router.navigate(['/front/dashboardF/forum/topic', topicId]);
  }

  navigateToCreateTopic(): void {
    this.router.navigate(['/front/dashboardF/forum/create-topic']);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
} 