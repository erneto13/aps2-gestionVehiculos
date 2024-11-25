import { Component } from '@angular/core';

// Components
import { DriversListComponent } from './shared/drivers-list/drivers-list.component';

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [DriversListComponent],
  templateUrl: './drivers.component.html',
})
export default class DriversComponent {

}
