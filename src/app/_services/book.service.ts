import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../_model/Book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private baseUrl = 'http://localhost:8086/api/books';

  constructor(private http: HttpClient) {}

  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.baseUrl);
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/${id}`);
  }

  getBooks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }

  addBook(
    title: string,
    author: string,
    description: string,
    coverImage: File,
    pdfFile: File
  ): Observable<Book> {
    const formData: FormData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('description', description);
    formData.append('file', coverImage);
    formData.append('pdfFile', pdfFile);
    return this.http.post<Book>(`${this.baseUrl}/add`, formData);
  }

  updateBook(
    id: number,
    title: string,
    author: string,
    description: string,
    coverImage?: File,
    pdfFile?: File
  ): Observable<Book> {
    const formData: FormData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('description', description);
    if (coverImage) {
      formData.append('file', coverImage);
    }
    if (pdfFile) {
      formData.append('pdfFile', pdfFile);
    }
    return this.http.put<Book>(`${this.baseUrl}/${id}`, formData);
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }
  getRecommendedBooks(bookId: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/${bookId}/recommendations`);
  }
}
