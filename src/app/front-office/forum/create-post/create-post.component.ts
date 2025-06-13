import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ForumService } from 'src/app/_services/forum.service';
import { UserAuthService } from 'src/app/_services/user-auth.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  postForm: FormGroup;
  loading = false;
  error = '';
  topicId: number = 0;
  topicName: string = '';
  username: string = '';
  topicFile: File | undefined;
  postFile: File | undefined;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private forumService: ForumService,
    private authService: UserAuthService
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(2000)]]
    });
  }

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    
    if (!(this.authService.isLoggedIn() || false)) {
      this.router.navigate(['/front/login']);
      return;
    }

    this.route.queryParamMap.subscribe(params => {
      const topicIdParam = params.get('topicId');
      if (topicIdParam) {
        this.topicId = parseInt(topicIdParam, 10);
        this.loadTopicInfo();
      } else {
        this.error = 'No topic specified';
      }
    });
  }

  loadTopicInfo(): void {
    this.forumService.getTopicById(this.topicId).subscribe(
      (data) => {
        this.topicName = data.name;
      },
      (error) => {
        this.error = 'Failed to load topic information';
        console.error('Error fetching topic:', error);
      }
    );
  }


  // onSubmit(): void {
  //   if (this.postForm.invalid) {
  //     return;
  //   }

  //   this.loading = true;
  //   const postData = this.postForm.value;
    
  //   this.forumService.createPost(postData, this.topicId, this.username).subscribe(
  //     (data) => {
  //       this.loading = false;
  //       this.router.navigate(['/front/dashboardF/forum/topic', this.topicId]);
  //     },
  //     (error) => {
  //       this.loading = false;
  //       this.error = 'Failed to create post. Please try again later.';
  //       console.error('Error creating post:', error);
  //     }
  //   );
  // }


   onSubmit(): void {
    if (this.postForm.invalid) return;

    this.loading = true;
    const postData = this.postForm.value;
    
    this.forumService.createPost(
      postData, 
      this.topicId, 
      this.username,
      this.postFile  // Pass the file
    ).subscribe(
      (data) => {
        this.loading = false;
        this.router.navigate(['/front/dashboardF/forum/topic', this.topicId]);
      },
      (error) => {
        this.loading = false;
        this.error = 'Failed to create post. Please try again later.';
        console.error('Error creating post:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.topicFile = event.target.files[0];
    } else {
      this.topicFile = undefined;
    }
  }
   onPostFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.postFile = event.target.files[0];
    }
  }

  cancel(): void {
    this.router.navigate(['/front/dashboardF/forum/topic', this.topicId]);
  }
} 