import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PageFlip } from 'page-flip';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.js';
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfWorker;
@Component({
  selector: 'app-book-reader',
  templateUrl: './book-reader.component.html',
  styleUrls: ['./book-reader.component.scss'],
})
export class BookReaderComponent implements OnInit {
  @Input() pdfUrl!: string;
  @ViewChild('flipbookContainer', { static: true })
  flipbookContainer!: ElementRef;

  ngOnInit() {
    console.log('PDF URL:', this.pdfUrl);
    if (this.pdfUrl) {
      this.loadPdfAsFlipbook(this.pdfUrl);
    }
  }

  async loadPdfAsFlipbook(url: string) {
    (pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfWorker;

    const pdf = await (pdfjsLib as any).getDocument(url).promise;
    const pages: HTMLCanvasElement[] = [];

    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: context, viewport }).promise;
      pages.push(canvas);
    }

    const pageElements = pages.map((canvas) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'page';
      wrapper.appendChild(canvas);
      return wrapper;
    });

    const book = new PageFlip(this.flipbookContainer.nativeElement, {
      width: 500,
      height: 500,
      size: 'stretch',
      showCover: true,
      maxShadowOpacity: 0.8,
      mobileScrollSupport: false,
    });

    book.loadFromHTML(pageElements);
  }
}
