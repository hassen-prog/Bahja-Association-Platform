import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ForumPost, PageResponse } from 'src/app/_model/forum.model';
import { ForumService } from 'src/app/_services/forum.service';

@Component({
  selector: 'app-forum-search',
  templateUrl: './forum-search.component.html',
  styleUrls: ['./forum-search.component.scss']
})
export class ForumSearchComponent implements OnInit {
  searchControl = new FormControl('');
  posts: ForumPost[] = [];
  loading = false;
  searching = false;
  error = '';
  currentPage = 0;
  totalPages = 0;
  searchQuery = '';

  constructor(
    private forumService: ForumService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(query => {
        if (query && query.trim().length > 2) {
          this.searchQuery = query;
          this.currentPage = 0;
          this.searchPosts();
        } else {
          this.posts = [];
          this.totalPages = 0;
          this.searchQuery = '';
        }
      });
  }

  searchPosts(): void {
    this.searching = true;
    this.forumService.searchPosts(this.searchQuery, this.currentPage).subscribe(
      (data: PageResponse<ForumPost>) => {
        this.posts = data.content;
        this.currentPage = data.number;
        this.totalPages = data.totalPages;
        this.searching = false;
      },
      (error) => {
        this.error = 'Failed to search posts';
        console.error('Error searching posts:', error);
        this.searching = false;
      }
    );
  }

  navigateToPost(postId: number): void {
    this.router.navigate(['/front/dashboardF/forum/post', postId]);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.searchPosts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.searchPosts();
    }
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }
} 