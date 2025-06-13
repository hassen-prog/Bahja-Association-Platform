import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForumPost, ForumComment } from 'src/app/_model/forum.model';
import { ForumService } from 'src/app/_services/forum.service';
import { UserAuthService } from 'src/app/_services/user-auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-forum-post',
  templateUrl: './forum-post.component.html',
  styleUrls: ['./forum-post.component.scss']
})
export class ForumPostComponent implements OnInit {
  postId: number = 0;
  post: ForumPost | null = null;
  comments: ForumComment[] = [];
  loading = false;
  error = '';
  username: string = '';
  likeCount = 0;
  hasUserLiked = false;
  newCommentContent = '';
  showCommentForm = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private forumService: ForumService,
    public authService: UserAuthService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.postId = parseInt(id, 10);
        this.loadPost();
        this.loadComments();
        this.checkUserLike();
        this.loadLikeCount();
      } else {
        this.error = 'Invalid post ID';
      }
    });
  }

  loadPost(): void {
    this.loading = true;
    this.forumService.getPostById(this.postId).subscribe(
      (data) => {
        this.post = data;
        this.loading = false;
      },
      (error) => {
        this.error = 'Failed to load post';
        console.error('Error fetching post:', error);
        this.loading = false;
      }
    );
  }

  loadComments(): void {
    this.forumService.getCommentsByPost(this.postId).subscribe(
      (data) => {
        this.comments = data;
      },
      (error) => {
        console.error('Error fetching comments:', error);
      }
    );
  }

  loadLikeCount(): void {
    this.forumService.countLikesByPost(this.postId).subscribe(
      (count) => {
        this.likeCount = count;
      },
      (error) => {
        console.error('Error fetching like count:', error);
      }
    );
  }

  checkUserLike(): void {
    if (!this.authService.isLoggedIn()) {
      return;
    }
    this.forumService.hasUserLikedPost(this.postId, this.username).subscribe(
      (hasLiked) => {
        this.hasUserLiked = hasLiked;
      },
      (error) => {
        console.error('Error checking user like:', error);
      }
    );
  }

  toggleLike(): void {
    if (!this.authService.isLoggedIn()) {
      return;
    }
    this.forumService.toggleLike(this.postId, this.username).subscribe(
      (like) => {
        // Update the like status and count
        this.hasUserLiked = !this.hasUserLiked;
        this.likeCount = this.hasUserLiked ? this.likeCount + 1 : this.likeCount - 1;
      },
      (error) => {
        console.error('Error toggling like:', error);
      }
    );
  }

  addComment(): void {
    if (!this.newCommentContent.trim()) {
      return;
    }
    const comment: ForumComment = {
      content: this.newCommentContent
    };
    this.forumService.createComment(comment, this.postId, this.username).subscribe(
      (newComment) => {
        this.comments.push(newComment);
        this.newCommentContent = '';
        this.showCommentForm = false;
      },
      (error) => {
        console.error('Error adding comment:', error);
      }
    );
  }

  toggleReplyForm(comment: ForumComment): void {
    comment.showReplyForm = !comment.showReplyForm;
    if (!comment.showReplyForm) {
      comment.replyContent = '';
    }
  }

  addReply(comment: ForumComment): void {
    if (!comment.replyContent?.trim()) {
      return;
    }
    const reply: ForumComment = {
      content: comment.replyContent,
      parentComment: { id: comment.id } // Set parent comment
    };
    this.forumService.createComment(reply, this.postId, this.username, comment.id).subscribe(
      (newReply) => {
        // Add the reply to the comment's replies array
        if (!comment.replies) {
          comment.replies = [];
        }
        comment.replies.push(newReply);
        comment.replyContent = '';
        comment.showReplyForm = false;
      },
      (error) => {
        console.error('Error adding reply:', error);
      }
    );
  }

  getSafeFileUrl(url: string): SafeUrl {
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      url = window.location.origin + url;
    }
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  
  getFileNameFromUrl(url: string): string {
    if (!url) return 'Attachment';
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  isImageFile(url: string): boolean {
    if (!url) return false;
    const fileName = this.getFileNameFromUrl(url).toLowerCase();
    return fileName.endsWith('.jpg') || 
           fileName.endsWith('.jpeg') || 
           fileName.endsWith('.png') || 
           fileName.endsWith('.gif');
  }
  
  isPdfFile(url: string): boolean {
    if (!url) return false;
    return this.getFileNameFromUrl(url).toLowerCase().endsWith('.pdf');
  }
}