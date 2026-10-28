import { Component } from '@angular/core';

import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Bahja-Association-Front';
  showAssistant = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      ) // <== Type guard
      .subscribe((event) => {
        this.showAssistant = !event.urlAfterRedirects.startsWith('/admin');
      });
  }
}
