import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FuelRecordResponse } from '../../../../../../../core/interfaces/fuel_records';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-fuel-records-table',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './fuel-records-table.component.html',
})
export class FuelRecordsTableComponent {
  @Input() fuelRecord: FuelRecordResponse[] = [];
  @Output() addFuelRecord = new EventEmitter<void>();

  onAddFuelRecord(): void {
    this.addFuelRecord.emit();
  }
}
