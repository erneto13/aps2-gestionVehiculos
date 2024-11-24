import { Component, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RemindersService } from '../../services/reminders.service';
import { CommonModule } from '@angular/common';
import { NewReminder } from '../../../../core/interfaces/reminders';

@Component({
  selector: 'app-reminder-form',
  standalone: true,
  imports: [ReminderFormComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './reminder-form.component.html',
})
export class ReminderFormComponent {
  @Output() reminderCreated = new EventEmitter<void>();
  reminderForm!: FormGroup;

  constructor(private fb: FormBuilder, private remindersService: RemindersService) {
    this.reminderForm = this.fb.group({
      vehicle: ['', [Validators.required]],
      due_date: ['', [Validators.required]],
      task: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.reminderForm.invalid) {
      console.error('form invalido');
      return
    }

    const reminder: NewReminder = {
      vehicle: this.reminderForm.value.vehicle,
      due_date: '2024-11-22 23:12:28',
      task: this.reminderForm.value.task
    };
    this.createReminder(reminder);
  }

  createReminder(reminder: NewReminder): void {
    this.remindersService.createReminder(reminder).subscribe(() => {
      this.reminderCreated.emit();
      this.reminderForm.reset();
    });
  }
}
