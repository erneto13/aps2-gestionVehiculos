import { Component, OnInit } from '@angular/core';
import { ReminderSearchbarComponent } from "../reminders/shared/reminder-searchbar/reminder-searchbar.component";
import { ReminderListComponent } from '../reminders/shared/reminder-list/reminder-list.component';
import { SettingsTableComponent } from './shared/settings-table/settings-table.component';
import { UserDriver } from '../../core/interfaces/drivers';
import { SettingService } from './services/setting.service';
import { ToastService } from '../../core/services/toast.service';
import { SettingsFormComponent } from './shared/settings-form/settings-form.component';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReminderSearchbarComponent, SettingsTableComponent, SettingsFormComponent, DialogModule],
  templateUrl: './settings.component.html',
})
export default class SettingsComponent implements OnInit {
  allUserDriver: UserDriver[] = [];
  displayedUserDriver: UserDriver[] = [];
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  searchTerm = '';
  visible: boolean = false;

  constructor(
    private settingsService: SettingService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadCredentials();
  }

  loadCredentials(): void {
    this.settingsService.getAllUserDrivers()
      .subscribe({
        next: (data) => {
          this.allUserDriver = data;
        },
        error: (error) => {
          this.toastService.showToast(
            'Se ha producido un error.',
            'No se lograron obtener las credenciales',
            'error'
          )
        }
      });
  }

  onSearch($event: string) {
    this.searchTerm = this.searchTerm;
    this.currentPage = 0;
    this.filterAndPaginateCredentials();
  }

  filterAndPaginateCredentials(): void {
    let filtered = this.allUserDriver;
    if (this.searchTerm) {
      const search = this.searchTerm.toLocaleLowerCase();
      filtered = this.allUserDriver.filter(userDriver =>
        userDriver.driverName.toLocaleLowerCase().includes(search) ||
        userDriver.userEmail.toLocaleLowerCase().includes(search)
      );
    }

    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    const startIndex = this.currentPage * this.pageSize;
    this.displayedUserDriver = filtered.slice(startIndex, startIndex + this.pageSize);
  }

  deleteCredential(id: number) {
    this.settingsService.deleteUserDriver(id)
      .subscribe({
        next: (data) => {
          this.loadCredentials();
          this.toastService.showToast(
            'Credencial eliminada',
            'La credencial fue eliminada correctamente',
            'success'
          )
        },
        error: (error) => {
          this.toastService.showToast(
            'Se ha producido un error.',
            'No se logró eliminar la credencial',
            'error'
          )
        }
      })
  }

  onChange(): void {
    this.visible = !this.visible;
  }
}
