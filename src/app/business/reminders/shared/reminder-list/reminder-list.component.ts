// Bodriular
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';


// Core
import { Reminder } from '../../../../core/interfaces/reminders';
import { RemindersService } from '../../services/reminders.service';
import { ReminderFormComponent } from '../reminder-form/reminder-form.component';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { ReminderPaginationComponent } from '../reminder-pagination/reminder-pagination.component';
import { ReminderTableComponent } from '../reminder-table/reminder-table.component';
import { ReminderSearchbarComponent } from '../reminder-searchbar/reminder-searchbar.component';

@Component({
  selector: 'app-reminder-list',
  standalone: true,
  imports: [ReminderFormComponent, TableModule, DialogModule,
    ReminderPaginationComponent, ReminderTableComponent,
    ReminderSearchbarComponent],
  templateUrl: './reminder-list.component.html'
})
export class ReminderListComponent implements OnInit {
  allReminders: Reminder[] = [];
  displayedReminders: Reminder[] = [];
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  searchTerm = '';
  visible: boolean = false;

  constructor(private remindersService: RemindersService) { }

  ngOnInit(): void {
    this.loadReminders();
  }

  loadReminders(): void {
    this.remindersService.getAllReminders()
      .subscribe({
        next: (data) => {
          this.allReminders = data;
          this.filterAndPaginateReminders();
          this.visible = false;
        },
        error: (error) => {
          console.error('Error fetching reminders:', error);
        }
      });
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.currentPage = 0;
    this.filterAndPaginateReminders();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.filterAndPaginateReminders();
  }

  filterAndPaginateReminders(): void {
    let filtered = this.allReminders;
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = this.allReminders.filter(reminder =>
        reminder.vehicle.toLowerCase().includes(search) ||
        reminder.task.toLowerCase().includes(search)
      );
    }

    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    const startIndex = this.currentPage * this.pageSize;
    this.displayedReminders = filtered.slice(startIndex, startIndex + this.pageSize);
  }

  deleteReminder(id: number): void {
    this.remindersService.deleteReminder(id)
      .subscribe({
        next: () => {
          this.loadReminders();
        },
        error: (error) => {
          console.error('Error deleting reminder:', error);
        }
      });
  }

  cambiar(): void {
    this.visible = !this.visible;
  }
}
