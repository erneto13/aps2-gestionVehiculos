import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../../../../core/interfaces/vehicle';
import { VehicleApiService } from '../../services/vehicle-api.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MaintenanceService } from '../../maintenance/services/maintenance.service';
import { MaintenanceResponse } from '../../../../core/interfaces/maintenance';

@Component({
  selector: 'app-vehiclesstatistic',
  standalone: true,
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './vehiclesstatistic.component.html',
})
export class VehiclesstatisticComponent implements OnInit {
  vehicles: Vehicle[] = [];
  maintenanceRecords: MaintenanceResponse[] = [];

  currentMonthMaintenanceExpense: number = 0;
  previousMonthMaintenanceExpense: number = 0;

  constructor(
    private vehiclesApiService: VehicleApiService,
    private maintenanceService: MaintenanceService
  ) { }

  ngOnInit(): void {
    this.loadVehicles();
    this.loadMaintenanceRecords();
  }

  getVehiclesInMaintenanceCount(): number {
    return this.vehicles.filter(vehicle => vehicle.status === 'Maintenance').length;
  }

  getMaintenancePercentage(): number {
    const totalVehicles = this.vehicles.length;
    const vehiclesInMaintenance = this.getVehiclesInMaintenanceCount();
    return parseFloat(((vehiclesInMaintenance / totalVehicles) * 100).toFixed(2));
  }

  getAvailableVehiclesCount(): number {
    return this.vehicles.filter(vehicle => vehicle.status !== 'Maintenance').length;
  }

  getAvailablePercentage(): number {
    const totalVehicles = this.vehicles.length;
    const availableVehicles = this.getAvailableVehiclesCount();
    return parseFloat(((availableVehicles / totalVehicles) * 100).toFixed(2));
  }

  getVehiclesPercentage(): number {
    const previousMonthTotal = 2;
    const vehiclesChange = this.vehicles.length - previousMonthTotal;
    return parseFloat(((vehiclesChange / previousMonthTotal) * 100).toFixed(2));
  }

  loadVehicles(): void {
    this.vehiclesApiService.getVehicles().subscribe((vehicles) => {
      this.vehicles = vehicles;
    });
  }

  loadMaintenanceRecords(): void {
    this.maintenanceService.getAllMaintenanceRecords().subscribe((records) => {
      this.maintenanceRecords = records;
      this.calculateMaintenanceExpenses();
    });
  }

  calculateMaintenanceExpenses(): void {
    const currentDate = new Date();
    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const currentMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const previousMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const previousMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

    const currentMonthRecords = this.maintenanceRecords.filter(record => {
      const recordDate = record.created_at ? new Date(record.created_at) : new Date();
      return recordDate >= currentMonthStart && recordDate <= currentMonthEnd;
    });

    const previousMonthRecords = this.maintenanceRecords.filter(record => {
      const recordDate = record.created_at ? new Date(record.created_at) : new Date();
      return recordDate >= previousMonthStart && recordDate <= previousMonthEnd;
    });

    this.currentMonthMaintenanceExpense = currentMonthRecords.reduce((total, record) => total + record.cost, 0);
    this.previousMonthMaintenanceExpense = previousMonthRecords.reduce((total, record) => total + record.cost, 0);
  }

  getMostUsedMaintenanceType(): string {
    if (!this.maintenanceRecords.length) {
      return 'Sin datos (0)'; 
    }

    const maintenanceTypeCounts: { [key: string]: number } = {};

    this.maintenanceRecords.forEach(record => {
      const maintenanceType = record.maintenanceType || 'Desconocido';
      maintenanceTypeCounts[maintenanceType] = (maintenanceTypeCounts[maintenanceType] || 0) + 1;
    });

    const mostUsedType = Object.entries(maintenanceTypeCounts).reduce((max, current) =>
      current[1] > max[1] ? current : max
    );

    return `${mostUsedType[0]} (${mostUsedType[1]})`; 
  }




  getMaintenanceExpenseChange(): number {
    if (this.previousMonthMaintenanceExpense === 0) {
      return 100;
    }
    return parseFloat((((this.currentMonthMaintenanceExpense - this.previousMonthMaintenanceExpense) / this.previousMonthMaintenanceExpense) * 100).toFixed(2));
  }
}
