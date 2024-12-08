import { Component } from '@angular/core';
import { PlacesService } from '../bookings/maps/services';
import { TrackingScreenComponent } from './maps/screens/tracking-screen/tracking-screen.component';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [TrackingScreenComponent],
  templateUrl: './routes.component.html',
})
export default class RoutesComponent {

  constructor(
    private placesService: PlacesService,
  ) { }
}
