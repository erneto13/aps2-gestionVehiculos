import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-vehicle-details',
  standalone: true,
  imports: [],
  templateUrl: './vehicle-details.component.html',
})
export class VehicleDetailsComponent {
  @Input() vehicle: any;
  @Output() back = new EventEmitter<void>();

  onBackClick() {
    this.back.emit();
  }
}
