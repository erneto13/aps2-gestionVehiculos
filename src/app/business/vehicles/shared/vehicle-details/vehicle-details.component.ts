import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VehicleApiService } from '../../services/vehicle-api.service';

@Component({
  selector: 'app-vehicle-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vehicle-details.component.html',
})
export default class VehicleDetailsComponent implements OnInit {
  @Input() vehicle: any;
  @Output() back = new EventEmitter<void>();

  constructor(
    private router: Router,
    private vi: VehicleApiService
  ) { }

  ngOnInit(): void {
    this.vi.selectedVehicle$.subscribe(vehicle => {
      if (!vehicle) {
        this.router.navigate(['/vehiculos']);
        return;
      }
      this.vehicle = vehicle;
    });
  }

  onBackClick() {
    this.back.emit();
    this.router.navigate(['/vehiculos']);
  }
}
