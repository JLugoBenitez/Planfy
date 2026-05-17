import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  compass, compassOutline, heart, heartOutline, heartDislikeOutline,
  personOutline, person, mailOutline, lockClosedOutline, arrowForwardOutline,
  arrowDownOutline, arrowUpOutline,
  rocketOutline, optionsOutline, timeOutline, locationOutline, mapOutline,
  close, closeOutline, shieldCheckmarkOutline, chevronForwardOutline, logOutOutline,
  searchOutline, searchSharp, shareSocialOutline, share, shuffleOutline, refreshOutline,
  moonOutline, sunnyOutline, contrastOutline, ellipsisHorizontal,
  starOutline, star, trophyOutline, trendingUpOutline, statsChartOutline,
  filterOutline, copyOutline, checkmarkCircle, checkmarkCircleOutline,
  informationCircleOutline, callOutline, calendarOutline, peopleOutline,
  sparklesOutline, sparkles,
} from 'ionicons/icons';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  template: `<ion-app><ion-router-outlet /></ion-app>`,
})
export class AppComponent {
  private theme = inject(ThemeService);

  constructor() {
    this.theme.init();
    addIcons({
      compass, compassOutline, heart, heartOutline, heartDislikeOutline,
      personOutline, person, mailOutline, lockClosedOutline, arrowForwardOutline,
      'arrow-down-outline': arrowDownOutline, 'arrow-up-outline': arrowUpOutline,
      rocketOutline, optionsOutline, timeOutline, locationOutline, mapOutline,
      close, closeOutline, shieldCheckmarkOutline, chevronForwardOutline, logOutOutline,
      searchOutline, searchSharp, shareSocialOutline, share, shuffleOutline, refreshOutline,
      moonOutline, sunnyOutline, contrastOutline, ellipsisHorizontal,
      starOutline, star, trophyOutline, trendingUpOutline, statsChartOutline,
      filterOutline, copyOutline, checkmarkCircle, checkmarkCircleOutline,
      informationCircleOutline, callOutline, calendarOutline, peopleOutline,
      sparklesOutline, sparkles,
    });
  }
}
