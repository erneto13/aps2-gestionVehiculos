import { Component } from '@angular/core';
import { ReminderListComponent } from './shared/reminder-list/reminder-list.component';

@Component({
  selector: 'app-reminders',
  standalone: true,
  imports: [ReminderListComponent],
  templateUrl: './reminders.component.html',
})
export default class RemindersComponent {

}
