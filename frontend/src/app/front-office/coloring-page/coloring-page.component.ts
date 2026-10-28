import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Input,
} from '@angular/core';
import { IconSetService } from '@coreui/icons-angular';
import { cilActionUndo, cilActionRedo, cilCloudDownload } from '@coreui/icons';
import { HttpClient } from '@angular/common/http';
interface ColorAction {
  element: SVGElement;
  previousFill: string;
  newFill: string;
}
@Component({
  selector: 'app-coloring-page',
  templateUrl: './coloring-page.component.html',
  styleUrls: ['./coloring-page.component.scss'],
})
export class ColoringPageComponent implements AfterViewInit {
  icons = {
    cisActionUndo: cilActionUndo,
    cisActionRedo: cilActionRedo,
    cisCloudDownload: cilCloudDownload,
  };

  constructor(private http: HttpClient, private iconSet: IconSetService) {
    // Register icons here
    this.iconSet.icons = { cilActionUndo, cilActionRedo };
  }
  undoStack: ColorAction[] = [];
  redoStack: ColorAction[] = [];
  @Input() svgUrl = 'assets/svgs/BirdSVG.svg';
  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef;

  selectedColor: string = '';

  palette2: string[] = this.generateHuePalette(24);
  palette: string[] = [
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#FFA500',
    '#800080',
    '#00FFFF',
    '#FFC0CB',
    '#A52A2A',
    '#808080',
    '#000000',
    '#FFFFFF',
    '#808000',
    '#008080',
    '#800000',
    '#ADD8E6',
    '#90EE90',
    '#FFD700',
    '#D2691E',
    '#4B0082',
    '#F0E68C',
    '#DC143C',
    '#FF69B4',
    '#B0C4DE',
    '#20B2AA',
  ];
  svgList = [
    'assets/svgs/AvocadoSVG.svg',
    'assets/svgs/BirdSVG.svg',
    'assets/svgs/catSVG.svg',
    'assets/svgs/flowersSVG.svg',
    'assets/svgs/icecreamSVG.svg',
    'assets/svgs/snacksSVG.svg',
  ];

  selectedSvg: string = this.svgList[0];
  // constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.loadSVG(this.selectedSvg);
  }
  private generateHuePalette(count: number): string[] {
    const palette: string[] = [];
    for (let i = 0; i < count; i++) {
      const hue = Math.round((360 / count) * i);
      palette.push(`hsl(${hue}, 100%, 50%)`);
    }
    return palette;
  }
  loadSVG(path: string): void {
    this.http.get(path, { responseType: 'text' }).subscribe((svgText) => {
      // Inject SVG into container
      this.svgContainer.nativeElement.innerHTML = svgText;

      const svgElement: SVGSVGElement =
        this.svgContainer.nativeElement.querySelector('svg');

      if (!svgElement) {
        console.error('No <svg> found!');
        return;
      }

      svgElement.setAttribute('width', '100%');
      svgElement.setAttribute('height', '100%');
      svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      svgElement.style.display = 'block';
      svgElement.style.maxWidth = '100%';
      svgElement.style.maxHeight = '100%';
      svgElement.style.objectFit = 'contain';

      const fillableElements = svgElement.querySelectorAll(
        'path, polygon, circle'
      );

      fillableElements.forEach((el) => {
        const svgEl = el as SVGElement;

        const currentFill = svgEl.getAttribute('fill');
        if (!currentFill || currentFill === 'none') {
          svgEl.setAttribute('fill', '#ececec');
        }

        svgEl.style.cursor = 'pointer';

        svgEl.addEventListener('click', () => {
          // if (this.selectedColor) {
          //   svgEl.style.fill = this.selectedColor;
          //   svgEl.style.fillOpacity = '1';
          // }
          if (this.selectedColor) {
            const previousFill = svgEl.getAttribute('fill') || '#ececec';
            const newFill = this.selectedColor;

            if (previousFill !== newFill) {
              // Save action to undo stack
              this.undoStack.push({
                element: svgEl,
                previousFill,
                newFill,
              });

              // Clear redo stack since we're starting a new branch
              this.redoStack = [];
              svgEl.style.fill = newFill;
              // svgEl.setAttribute('fill', newFill);
              svgEl.style.fillOpacity = '1';
            }
          }
        });
      });
    });
  }
  undo(): void {
    const lastAction = this.undoStack.pop();
    if (lastAction) {
      lastAction.element.style.fill = lastAction.previousFill;
      this.redoStack.push(lastAction);
    }
  }

  redo(): void {
    const nextAction = this.redoStack.pop();
    if (nextAction) {
      nextAction.element.style.fill = nextAction.newFill;
      this.undoStack.push(nextAction);
    }
  }
  getCursorStyle() {
    return this.selectedColor
      ? { cursor: 'url("assets/icons/bucket-cursor.png"), auto' }
      : {};
  }
  selectSvg(svgPath: string): void {
    this.selectedSvg = svgPath;
    this.loadSVG(svgPath);
  }
  selectColor(color: string): void {
    console.log('Selected color:', color);
    this.selectedColor = color;
  }
  downloadSVG(): void {
    const svgElement: SVGSVGElement | null =
      this.svgContainer.nativeElement.querySelector('svg');

    if (!svgElement) {
      console.error('No SVG found to download.');
      return;
    }

    // Serialize the SVG into a string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

    // Create a Blob from the SVG string
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Create a temporary <a> element and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'colored-drawing.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Revoke the object URL after download
    URL.revokeObjectURL(url);
  }
}
