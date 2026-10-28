import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ForumPost,
  ForumTopic,
  PageResponse,
} from 'src/app/_model/forum.model';
import { ForumService } from 'src/app/_services/forum.service';
import { UserAuthService } from 'src/app/_services/user-auth.service';
import { DomSanitizer, SafeUrl, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forum-topic',
  templateUrl: './forum-topic.component.html',
  styleUrls: ['./forum-topic.component.scss'],
})
export class ForumTopicComponent implements OnInit {
  topicId: number = 0;
  topic: ForumTopic | null = null;
  posts: ForumPost[] = [];
  currentPage = 0;
  totalPages = 0;
  loading = false;
  error = '';
  username: string = '';
  fileTextContent: SafeHtml | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private forumService: ForumService,
    public authService: UserAuthService,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.topicId = parseInt(id, 10);
        this.loadTopic();
        this.loadPosts();
      } else {
        this.error = 'Invalid topic ID';
      }
    });
  }

  loadTopic(): void {
    this.loading = true;
    this.forumService.getTopicById(this.topicId).subscribe(
      (data) => {
        this.topic = data;
        this.loading = false;

        // If there's a file URL, load the text content if it's a text file
        if (
          this.topic &&
          this.topic.fileUrl &&
          this.isTextFile(this.topic.fileUrl)
        ) {
          this.loadTextFileContent(this.topic.fileUrl);
        }
      },
      (error) => {
        this.error = 'Failed to load topic';
        console.error('Error fetching topic:', error);
        this.loading = false;
      }
    );
  }

  loadPosts(page: number = 0): void {
    this.loading = true;
    this.forumService.getPostsByTopic(this.topicId, page).subscribe(
      (data: PageResponse<ForumPost>) => {
        this.posts = data.content;
        this.currentPage = data.number;
        this.totalPages = data.totalPages;
        this.loading = false;
      },
      (error) => {
        this.error = 'Failed to load posts';
        console.error('Error fetching posts:', error);
        this.loading = false;
      }
    );
  }

  navigateToCreatePost(): void {
    this.router.navigate(['/front/dashboardF/forum/create-post'], {
      queryParams: { topicId: this.topicId },
    });
  }

  navigateToPost(postId: number): void {
    this.router.navigate(['/front/dashboardF/post', postId]);
  }

  navigateToTopics(): void {
    this.router.navigate(['/front/dashboardF/forum']);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.loadPosts(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.loadPosts(this.currentPage - 1);
    }
  }

  canCreatePost(): boolean {
    return this.authService.isLoggedIn() ? true : false;
  }

  getSafeFileUrl(url: string): SafeUrl {
    // If the URL doesn't start with http or https, assume it's a relative URL
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      url = window.location.origin + url;
    }
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  getFileNameFromUrl(url: string): string {
    if (!url) return 'Attachment';

    // Extract the filename from the URL
    const parts = url.split('/');
    const fullFileName = parts[parts.length - 1];

    // Remove any UUID prefix if present (looking for the underscore after UUID)
    const underscoreIndex = fullFileName.indexOf('_');
    if (underscoreIndex !== -1 && underscoreIndex + 1 < fullFileName.length) {
      return fullFileName.substring(underscoreIndex + 1);
    }

    return fullFileName;
  }

  // File type checking
  isImageFile(url: string): boolean {
    if (!url) return false;
    const fileName = this.getFileNameFromUrl(url).toLowerCase();
    return (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif') ||
      fileName.endsWith('.bmp') ||
      fileName.endsWith('.webp') ||
      fileName.endsWith('.svg')
    );
  }

  isPdfFile(url: string): boolean {
    if (!url) return false;
    return this.getFileNameFromUrl(url).toLowerCase().endsWith('.pdf');
  }

  isTextFile(url: string): boolean {
    if (!url) return false;
    const fileName = this.getFileNameFromUrl(url).toLowerCase();
    return (
      fileName.endsWith('.txt') ||
      fileName.endsWith('.md') ||
      fileName.endsWith('.css') ||
      fileName.endsWith('.html') ||
      fileName.endsWith('.js') ||
      fileName.endsWith('.ts') ||
      fileName.endsWith('.json') ||
      fileName.endsWith('.xml') ||
      fileName.endsWith('.csv')
    );
  }

  loadTextFileContent(url: string): void {
    if (!url) return;

    const fileUrl =
      url.startsWith('http://') || url.startsWith('https://')
        ? url
        : window.location.origin + url;

    this.http.get(fileUrl, { responseType: 'text' }).subscribe(
      (content) => {
        // For code files, we should add syntax highlighting
        // For simplicity, just wrapping in pre tag for now
        const formattedContent = `<pre>${this.escapeHtml(content)}</pre>`;
        this.fileTextContent =
          this.sanitizer.bypassSecurityTrustHtml(formattedContent);
      },
      (error) => {
        console.error('Error loading text file:', error);
        this.fileTextContent = this.sanitizer.bypassSecurityTrustHtml(
          '<p>Error loading file content</p>'
        );
      }
    );
  }
  // Helper method to escape HTML
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
