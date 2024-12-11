// Bodriular
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Core
import { Reminder } from '../../../../core/interfaces/reminders';
import { RemindersService } from '../../services/reminders.service';
import { ReminderFormComponent } from '../reminder-form/reminder-form.component';
import { ReminderPaginationComponent } from '../reminder-pagination/reminder-pagination.component';
import { ReminderTableComponent } from '../reminder-table/reminder-table.component';
import { ReminderSearchbarComponent } from '../reminder-searchbar/reminder-searchbar.component';
import { LoadingService } from '../../../../core/services/loading.service';
import { SpinnerComponent } from '../../../../shared/utils/spinner/spinner.component';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-reminder-list',
  standalone: true,
  imports: [ReminderFormComponent, TableModule, DialogModule,
    ReminderPaginationComponent, ReminderTableComponent,
    ReminderSearchbarComponent, SpinnerComponent, CommonModule],
  templateUrl: './reminder-list.component.html'
})
export class ReminderListComponent implements OnInit {
  allReminders: Reminder[] = [];
  displayedReminders: Reminder[] = [];
  currentPage = 0;
  pageSize = 200;
  totalPages = 0;
  searchTerm = '';
  visible: boolean = false;

  isLoadingReminders: boolean = true;

  constructor(
    private remindersService: RemindersService,
    public loadingService: LoadingService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadReminders();
  }

  loadReminders(): void {
    this.isLoadingReminders = true;
    this.remindersService.getAllReminders()
      .subscribe({
        next: (data) => {
          this.allReminders = data;
          this.filterAndPaginateReminders();
          this.visible = false;
          this.isLoadingReminders = false;
        },
        error: (error) => {
          this.toastService.showToast(
            'Se ha producido un error.',
            'No se lograron obtener las reservas',
            'error'
          )
          this.isLoadingReminders = false;
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
          this.toastService.showToast(
            'Recordatorio eliminado correctamente.',
            'El recordatorio ha sido eliminado',
            'success'
          )
        },
        error: (error) => {
          this.toastService.showToast(
            'Se ha producido un error.',
            'No se logro eliminar el recordatorio' + error.message,
            'error'
          )
        }
      });
  }

  cambiar(): void {
    this.visible = !this.visible;
  }
}
