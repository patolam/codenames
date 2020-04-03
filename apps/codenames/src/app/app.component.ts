import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppRepository } from './app.repository';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cdn-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private router: Router,
    private appRepository: AppRepository,
    private translate: TranslateService
  ) {
    translate.setDefaultLang('pl');
    translate.use('pl');

    const urlSegments: string[] = location.pathname.split('/').filter(segment => segment.length > 0);

    if (urlSegments.length < 2) {
      this.appRepository.getRandId().pipe(
        take(1)
      ).subscribe(({ id }) => {
        this.router.navigate([`board/${id}`]);
      });
    }
  }
}
