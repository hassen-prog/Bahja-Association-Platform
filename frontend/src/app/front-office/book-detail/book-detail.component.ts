import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Book } from 'src/app/_model/Book';
import { BookService } from 'src/app/_services/book.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss'],
})
export class BookDetailComponent implements OnInit {
  book!: Book;
  bookReaderKey = 0;

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  recommendedBooks: Book[] = [];

  getRecommendations(id: number) {
    this.bookService.getRecommendedBooks(id).subscribe({
      next: (books) => {
        console.log('Fetched recommended books:', books);
        this.recommendedBooks = books;
      },
      error: (err) => {
        console.error('Failed to load recommendations', err);
      },
    });
  }
  trackByCoverUrl(index: number, slide: any): string {
    return slide.coverImageUrl;
  }
  ngOnInit(): void {
    // Watch for changes in the route parameter
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadBook(id);
      }
    });
  }
  loadBook(id: number): void {
    this.bookService.getBookById(id).subscribe((book) => {
      this.book = book;
      this.book.pdfUrl = `http://localhost:8086${book.pdfUrl}`;
      this.bookReaderKey++;
      this.getRecommendations(id);
    });
  }
  goToBookDetail(bookId: number) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/front/dashboardF/bookDetail', bookId]);
    });
  }
}
