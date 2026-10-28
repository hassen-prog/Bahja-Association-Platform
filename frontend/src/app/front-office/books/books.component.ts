import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from 'src/app/_model/Book';
import { BookService } from 'src/app/_services/book.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  // books!: Book[];

  // constructor(private bookService: BookService, private router: Router) {}

  // ngOnInit(): void {
  //   this.bookService.getAllBooks().subscribe(data => {
  //     this.books = data;
  //   });
  // }

  // selectBook(book: Book): void {
  //   this.router.navigate(['/front/book', book.id]);
  // }


  books: any[] = [];

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe(data => {
      this.books = data;
    }, error => console.log(error));
  }
}
