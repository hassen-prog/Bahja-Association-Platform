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
// import {
//   Component,
//   ElementRef,
//   Input,
//   OnInit,
//   ViewChild,
//   OnChanges,
//   SimpleChanges,
// } from '@angular/core';
// import { PageFlip } from 'page-flip';
// import * as pdfjsLib from 'pdfjs-dist';
// import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.js';

// (pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfWorker;

// @Component({
//   selector: 'app-book-reader',
//   templateUrl: './book-reader.component.html',
//   styleUrls: ['./book-reader.component.scss'],
// })
// export class BookReaderComponent implements OnInit, OnChanges {
//   @Input() pdfUrl!: string;
//   @ViewChild('flipbookContainer', { static: true })
//   flipbookContainer!: ElementRef;

//   private bookInstance: any;

//   ngOnInit() {
//     if (this.pdfUrl) {
//       this.loadPdfAsFlipbook(this.pdfUrl);
//     }
//   }

//   ngOnChanges(changes: SimpleChanges) {
//     if (changes['pdfUrl'] && !changes['pdfUrl'].firstChange) {
//       // If the URL changed (after first load), reload the flipbook
//       this.clearFlipbook();
//       this.loadPdfAsFlipbook(this.pdfUrl);
//     }
//   }

//   async loadPdfAsFlipbook(url: string) {
//     const pdf = await (pdfjsLib as any).getDocument(url).promise;
//     const pages: HTMLCanvasElement[] = [];

//     for (let i = 0; i < pdf.numPages; i++) {
//       const page = await pdf.getPage(i + 1);
//       const viewport = page.getViewport({ scale: 2 });
//       const canvas = document.createElement('canvas');
//       const context = canvas.getContext('2d')!;
//       canvas.width = viewport.width;
//       canvas.height = viewport.height;
//       await page.render({ canvasContext: context, viewport }).promise;
//       pages.push(canvas);
//     }

//     const pageElements = pages.map((canvas) => {
//       const wrapper = document.createElement('div');
//       wrapper.className = 'page';
//       wrapper.appendChild(canvas);
//       return wrapper;
//     });

//     this.bookInstance = new PageFlip(this.flipbookContainer.nativeElement, {
//       width: 500,
//       height: 500,
//       size: 'stretch',
//       showCover: true,
//       maxShadowOpacity: 0.8,
//       mobileScrollSupport: false,
//     });

//     this.bookInstance.loadFromHTML(pageElements);
//   }

//   clearFlipbook() {
//     if (this.bookInstance) {
//       this.bookInstance.destroy();
//       this.flipbookContainer.nativeElement.innerHTML = '';
//     }
//   }
// }
