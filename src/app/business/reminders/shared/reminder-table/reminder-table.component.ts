import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Reminder } from '../../../../core/interfaces/reminders';

@Component({
  selector: 'app-reminder-table',
  standalone: true,
  imports: [],
  templateUrl: './reminder-table.component.html',
})
export class ReminderTableComponent {
  @Input() reminders: Reminder[] = [];
  tableHeaders: string[] = ['Vehículo', 'Fecha de vencimiento', 'Recordatorio', 'Acciones'];
  @Output() delete = new EventEmitter<number>();

  deleteReminder(id: number): void {
    this.delete.emit(id);
  }
}
