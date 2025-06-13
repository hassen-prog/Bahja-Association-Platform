import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForumService } from 'src/app/_services/forum.service';
import { UserAuthService } from 'src/app/_services/user-auth.service';

@Component({
  selector: 'app-create-topic',
  templateUrl: './create-topic.component.html',
  styleUrls: ['./create-topic.component.scss']
})
export class CreateTopicComponent implements OnInit {
  topicForm: FormGroup;
  loading = false;
  error = '';
  username: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private forumService: ForumService,
    private authService: UserAuthService
  ) {
    this.topicForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/front/login']);
    }
  }

  onSubmit(): void {
    if (this.topicForm.invalid) {
      return;
    }

    this.loading = true;
    const topicData = this.topicForm.value;
    
    this.forumService.createTopic(topicData, this.username).subscribe(
      (data) => {
        this.loading = false;
        this.router.navigate(['/front/dashboardF/forum/topic', data.id]);
      },
      (error) => {
        this.loading = false;
        if (error.status === 400 && error.error.message.includes('already exists')) {
          this.error = 'A topic with this name already exists. Please choose a different name.';
        } else {
          this.error = 'Failed to create topic. Please try again later.';
        }
        console.error('Error creating topic:', error);
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/front/dashboardF/forum']);
  }
} 