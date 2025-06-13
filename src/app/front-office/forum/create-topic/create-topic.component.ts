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
  topicFile: File | undefined;

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
    if (!(this.authService.isLoggedIn() || false)) {
      this.router.navigate(['/front/login']);
      return;
    }
    
    // Debug user roles and token
    console.log('Current user roles:', this.authService.getRoles());
    console.log('JWT Token exists:', !!this.authService.getToken());
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.topicFile = event.target.files[0];
    } else {
      this.topicFile = undefined;
    }
  }

  onSubmit(): void {
    if (this.topicForm.invalid) {
      return;
    }

    // Check user authorization before submitting
    console.log('Submitting as user:', this.username);
    console.log('User roles:', this.authService.getRoles());
    console.log('Is user logged in:', this.authService.isLoggedIn());
    console.log('Is user admin:', this.authService.isAdmin());
    console.log('Is user "User" role:', this.authService.isUser());

    this.loading = true;
    const topicData = this.topicForm.value;
    
    this.forumService.createTopic(topicData, this.username, this.topicFile).subscribe(
      (data) => {
        this.loading = false;
        this.router.navigate(['/front/dashboardF/forum/topic', data.id]);
      },
      (error) => {
        this.loading = false;
        if (error.status === 400 && error.error.message.includes('already exists')) {
          this.error = 'A topic with this name already exists. Please choose a different name.';
        } else if (error.status === 403) {
          this.error = 'You do not have permission to create a topic. Please contact an administrator.';
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