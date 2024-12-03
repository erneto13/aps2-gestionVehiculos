import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../core/services/auth.service';
import { BookingsService } from '../bookings/services/bookings.service';
import { VehicleApiService } from '../vehicles/services/vehicle-api.service';
import { FuelAnalyticsService } from '../../core/services/fuel-analytics.service';
import { catchError, EMPTY, tap } from 'rxjs';

import { OverviewCardsComponent } from './shared/overview-cards/overview-cards.component';
import { ExpenseChartComponent } from './shared/expense-chart/expense-chart.component';
import { RecentBookingsComponent } from './shared/recent-bookings/recent-bookings.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule,
    OverviewCardsComponent,
    ExpenseChartComponent,
    RecentBookingsComponent],
  templateUrl: './dashboard.component.html',
})
export default class DashboardComponent {
  fuelChartData: any;
  fuelChartOptions: any;
  bookings: any[] = [];

  _$combustible!: number;
  percentageChange = 0;

  constructor(
    private auth: Auth,
    private bookingService: BookingsService,
    private vehicleService: VehicleApiService,
    private fuelAnalyticsService: FuelAnalyticsService
  ) { }

  ngOnInit() {
    this.loadFuelRecords();
  }

  loadFuelRecords() {
    this.vehicleService.getAllFuelRecord().pipe(
      tap(records => {
        const monthCostMap = this.fuelAnalyticsService.calculateMonthCosts(records);

        const months = Object.keys(monthCostMap);
        const costData = months.map(month => monthCostMap[month]);

        this._$combustible = costData.reduce((total, cost) => total + cost, 0);
        this.percentageChange = this.fuelAnalyticsService.calculateFuelPercentageChange(records);

        this.generateFuelChartData(months, costData);
        this.loadBookings();
      }),
      catchError(error => {
        console.error('Error loading fuel records', error);
        return EMPTY;
      })
    ).subscribe();
  }

  generateFuelChartData(months: string[], costData: number[]) {
    const documentStyle = getComputedStyle(document.documentElement);

    this.fuelChartData = {
      labels: months,
      datasets: [
        {
          label: 'Gastos en combustible',
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          yAxisID: 'y',
          tension: 0.4,
          data: costData,
        }
      ]
    };

    this.fuelChartOptions = this.fuelAnalyticsService.getChartOptions(documentStyle);
  }

  loadBookings(): void {
    this.bookingService.getAllBookings().subscribe((bookings) => {
      this.bookings = bookings;
    });
  }
}
