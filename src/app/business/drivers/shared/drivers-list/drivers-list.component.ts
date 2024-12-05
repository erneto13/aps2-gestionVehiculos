// Bodriular
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Core
import { Drivers } from '../../../../core/interfaces/drivers';
import { DriversService } from '../../services/drivers.service';
import { DriversFormComponent } from '../drivers-form/drivers-form.component';
import { DriversPaginationComponent } from '../drivers-pagination/drivers-pagination.component';
import { DriversSearchbarComponent } from '../drivers-searchbar/drivers-searchbar.component';
import { DriversTableComponent } from '../drivers-table/drivers-table.component';
import { LoadingService } from '../../../../core/services/loading.service';
import { SpinnerComponent } from '../../../../shared/utils/spinner/spinner.component';

// PrimeNG
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-drivers-list',
  standalone: true,
  imports: [DialogModule, DriversFormComponent,
    DriversPaginationComponent,
    DriversSearchbarComponent, DriversTableComponent, CommonModule, SpinnerComponent],
  templateUrl: './drivers-list.component.html',
})
export class DriversListComponent implements OnInit {
  allDrivers: Drivers[] = [];
  displayedDrivers: Drivers[] = [];
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  searchTerm = '';
  visible: boolean = false;

  editModalVisible: boolean = false;
  driverToEdit: Drivers | null = null;


  constructor(private driverService: DriversService, public loadingService: LoadingService) { }

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers(): void {
    this.driverService.getDrivers().
      subscribe({
        next: (data) => {
          this.allDrivers = data;
          this.filterAndPaginateDrivers();
          this.visible = false;
        },
        error: (error) => {
          console.error('Error fetching drivers:', error);
        }
      })
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.currentPage = 0;
    this.filterAndPaginateDrivers();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.filterAndPaginateDrivers();
  }

  filterAndPaginateDrivers(): void {
    let filtered = this.allDrivers;
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = this.allDrivers.filter(drivers =>
        drivers.name.toLowerCase().includes(search) ||
        drivers.phone.toLowerCase().includes(search)
      );
    }

    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    const startIndex = this.currentPage * this.pageSize;
    this.displayedDrivers = filtered.slice(startIndex, startIndex + this.pageSize);
  }

  deleteDriver(id: number): void {
    this.driverService.deleteDriver(id)
      .subscribe({
        next: () => {
          this.loadDrivers();
        },
        error: (error) => {
          console.error('Error deleting driver:', error);
        }
      });
  }

  onEditDriver(driver: Drivers): void {
    this.driverToEdit = { ...driver };
    this.editModalVisible = true;
  }

  onDriverUpdated(updatedDriver: Drivers): void {
    const index = this.allDrivers.findIndex(d => d.driver_id === updatedDriver.driver_id);
    if (index !== -1) {
      this.allDrivers[index] = updatedDriver;
      this.filterAndPaginateDrivers();
    }
    this.editModalVisible = false;
  }

  change() {
    this.visible = !this.visible;
  }
}
