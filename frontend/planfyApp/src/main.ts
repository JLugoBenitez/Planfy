import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { authInterceptor } from './app/interceptors/auth.interceptor';
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
  sparklesOutline, sparkles, chevronDownCircleOutline, reloadOutline,
} from 'ionicons/icons';

// Registramos los iconos ANTES del bootstrap para evitar warnings de
// ion-refresher-content cuando intenta cargar 'arrow-down-outline' en su
// connectedCallback (que ocurre antes que el constructor de AppComponent).
addIcons({
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
  sparklesOutline, sparkles, chevronDownCircleOutline, reloadOutline,
  // Aliases en kebab-case que Ionic usa por defecto en algunos componentes
  'arrow-down-outline': arrowDownOutline,
  'arrow-up-outline': arrowUpOutline,
  'chevron-down-circle-outline': chevronDownCircleOutline,
  'reload-outline': reloadOutline,
});

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(IonicModule.forRoot({})),
  ]
});
