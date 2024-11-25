import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiZXJuZXRvMTMiLCJhIjoiY20zd2I2MW10MTFueTJycHUxdXl0Y3ZzZiJ9.fUMW24vzqzc9Ul9vuXYUtA';

if (!navigator.geolocation) {
  alert('Geolocation is not available');
  throw new Error('Geolocation is not available');
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
