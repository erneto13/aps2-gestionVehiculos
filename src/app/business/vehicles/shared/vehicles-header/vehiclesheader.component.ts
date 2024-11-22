import { Component } from '@angular/core';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { VehicleAddComponent } from "../vehicle-add/vehicle-add.component";

@Component({
  selector: 'app-vehiclesheader',
  standalone: true,
  imports: [DialogModule, VehicleAddComponent],
  templateUrl: './vehiclesheader.component.html',
})
export class VehiclesheaderComponent {
  // Variables
  display: boolean = false;
  position: string = 'center';


  onAddVehicle() {
    this.display = true;
  }

  onCloseModal() {
    this.display = false;
  }
}
