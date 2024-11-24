// Bodriular
import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Core
import { RemindersService } from '../../services/reminders.service';
import { VehicleApiService } from '../../../vehicles/services/vehicle-api.service';
import { SharedService } from '../../../../core/services/shared.service';
import { NewReminder } from '../../../../core/interfaces/reminders';

@Component({
  selector: 'app-reminder-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reminder-form.component.html',
})
export class ReminderFormComponent implements OnInit {
  @Output() reminderCreated = new EventEmitter<void>();
  reminderForm!: FormGroup;
  vehicles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private remindersService: RemindersService,
    private vehicleApiService: VehicleApiService,
    private sharedService: SharedService
  ) {
    this.reminderForm = this.fb.group({
      vehicle: ['', [Validators.required]],
      due_date: ['', [Validators.required]],
      task: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadVehicles();
  }

  onSubmit(): void {
    if (this.reminderForm.invalid) {
      console.error('Form is invalid');
      return;
    }
    const rawDate = this.sharedService.convertToMySQLTimestamp(
      this.reminderForm.value.due_date
    );

    const reminder: NewReminder = {
      vehicle: this.reminderForm.value.vehicle,
      due_date: rawDate,
      task: this.reminderForm.value.task,
    };
    this.createReminder(reminder);
  }

  createReminder(reminder: NewReminder): void {
    this.remindersService.createReminder(reminder).subscribe(() => {
      this.reminderCreated.emit();
      this.reminderForm.reset();
    });
  }

  loadVehicles(): void {
    this.vehicleApiService.getVehicles().subscribe((vehicles) => {
      this.vehicles = vehicles;
    });
  }
}
