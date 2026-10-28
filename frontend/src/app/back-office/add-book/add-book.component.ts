import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/_model/Book';
import { BookService } from 'src/app/_services/book.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
})
export class AddBookComponent implements OnInit {
  pdfFile?: File;
  bookTitle = '';
  bookAuthor = '';
  bookDescription = '';
  coverImage?: File;
  successMessage: string = '';
  books: any[] = [];
  isModalOpen = false;

  selectedBook: Book = new Book();

  constructor(private bookService: BookService) {}

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.coverImage = event.target.files[0];
    } else {
      this.coverImage = undefined;
    }
  }

  onFileSelectedPdf(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.pdfFile = file;
    } else {
      alert('Please select a valid PDF file.');
    }
  }
  ngOnInit(): void {
    this.loadBooks();
  }

  addBook(): void {
    if (
      this.bookTitle &&
      this.bookAuthor &&
      this.bookDescription &&
      this.coverImage &&
      this.pdfFile
    ) {
      this.bookService
        .addBook(
          this.bookTitle,
          this.bookAuthor,
          this.bookDescription,
          this.coverImage,
          this.pdfFile
        )
        .subscribe({
          next: (book) => {
            console.log('Book added successfully', book);
            this.resetForm();
            this.successMessage = 'Book added successfully!';
            setTimeout(() => (this.successMessage = ''), 3000);
            this.loadBooks();
          },
          error: (error) => {
            console.error('Error adding book', error);
            this.successMessage = 'Failed to add the book. Please try again!';
            setTimeout(() => (this.successMessage = ''), 3000);
          },
        });
    } else {
      console.error('All fields are required');
      this.successMessage = 'Please fill all the fields!';
      setTimeout(() => (this.successMessage = ''), 3000);
    }
  }

  private resetForm(): void {
    this.bookTitle = '';
    this.bookAuthor = '';
    this.bookDescription = '';
    this.coverImage = undefined;
    this.pdfFile = undefined;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe(
      (data) => {
        this.books = data;
      },
      (error) => console.log(error)
    );
  }

  openEditModal(book: Book): void {
    this.selectedBook = { ...book };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  updateBook(): void {
    this.bookService
      .updateBook(
        this.selectedBook.id,
        this.selectedBook.title,
        this.selectedBook.author,
        this.selectedBook.description,
        this.coverImage,
        this.pdfFile
      )
      .subscribe({
        next: (updatedBook) => {
          console.log('Book updated', updatedBook);
          this.closeModal();
          this.loadBooks();
        },
        error: (error) => {
          console.error('Error updating book', error);
          this.closeModal();
        },
      });
  }

  deleteBook(id: number): void {
    this.bookService.deleteBook(id).subscribe({
      next: (response) => {
        console.log('Book deleted successfully');
        this.books = this.books.filter((book) => book.id !== id);
      },
      error: (error) => {
        console.error('There was an error deleting the book', error);
      },
    });
  }
}
