import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/_model/Book';
import { BookService } from 'src/app/_services/book.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss'],
})
export class BookDetailComponent implements OnInit {
  book!: Book;

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute
  ) {}
  recommendedBooks: Book[] = [];
  getRecommendations(id: number) {
    this.bookService.getRecommendedBooks(id).subscribe({
      next: (books) => {
        this.recommendedBooks = books;
      },
      error: (err) => {
        console.error('Failed to load recommendations', err);
      },
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.bookService.getBookById(id).subscribe((book) => {
          this.book = book;
          this.book.pdfUrl = `http://localhost:8086${book.pdfUrl}`;
          this.getRecommendations(id);
        });
      }
    });
  }
}
