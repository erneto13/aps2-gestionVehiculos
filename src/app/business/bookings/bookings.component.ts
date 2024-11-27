import { Component } from '@angular/core';
import { BookingsListComponent } from './shared/bookings-list/bookings-list.component';
import { PlacesService } from './maps/services';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [BookingsListComponent],
  templateUrl: './bookings.component.html',
})
export default class BookingsComponent {

  constructor(private placesService: PlacesService) { }

}
