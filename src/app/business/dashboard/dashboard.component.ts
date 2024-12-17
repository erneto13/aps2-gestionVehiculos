import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../core/services/auth.service';
import { BookingsService } from '../bookings/services/bookings.service';
import { VehicleApiService } from '../vehicles/services/vehicle-api.service';
import { FuelAnalyticsService } from '../../core/services/fuel-analytics.service';
import { IssueAnalyticsService } from '../../core/services/issue-analytics.service'; // Servicio de Issues
import { catchError, EMPTY, tap } from 'rxjs';

import { OverviewCardsComponent } from './shared/overview-cards/overview-cards.component';
import { ExpenseChartComponent } from './shared/expense-chart/expense-chart.component';
import { RecentBookingsComponent } from './shared/recent-bookings/recent-bookings.component';
import { OverviewCard } from '../../core/interfaces/utils';
import { ContactsService } from '../contacts/services/contacts.service';
import { IssuesService } from '../issues/services/issues.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    OverviewCardsComponent,
    ExpenseChartComponent,
    RecentBookingsComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export default class DashboardComponent implements OnInit {
  fuelChartData: any;
  fuelChartOptions: any;
  issueChartData: any;
  issueChartOptions: any;
  activeChart: 'fuel' | 'issues' = 'fuel'; // Controla el gráfico activo

  bookings: any[] = [];
  vehicles: any[] = [];
  customers: any[] = [];

  _$combustible!: number;
  percentageChange = 0;

  overviewCards: OverviewCard[] = [];
  isFuelChart = true;

  constructor(
    private auth: Auth,
    private bookingService: BookingsService,
    private vehicleService: VehicleApiService,
    private fuelAnalyticsService: FuelAnalyticsService,
    private issueAnalyticsService: IssueAnalyticsService,
    private customerService: ContactsService,
    private issueService: IssuesService
  ) { }

  ngOnInit() {
    this.loadFuelRecords();
    this.loadIssues();
    this.loadVehicles();
    this.loadCustomers();
  }

  loadFuelRecords() {
    this.vehicleService
      .getAllFuelRecord()
      .pipe(
        tap((records) => {
          const monthCostMap = this.fuelAnalyticsService.calculateMonthCosts(records);
          const months = Object.keys(monthCostMap);
          const costData = months.map((month) => monthCostMap[month]);

          this._$combustible = costData.reduce((total, cost) => total + cost, 0);
          this.percentageChange = this.fuelAnalyticsService.calculateFuelPercentageChange(records);

          this.generateFuelChartData(months, costData);
          this.loadBookings();
        }),
        catchError((error) => {
          console.error('Error loading fuel records', error);
          return EMPTY;
        })
      )
      .subscribe();
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
        },
      ],
    };

    this.fuelChartOptions = this.fuelAnalyticsService.getChartOptions(documentStyle);
  }

  loadIssues() {
    this.issueService.getIssues().pipe(
      tap((issues) => {
        const frequencyMap = this.issueAnalyticsService.calculateIssueTypeFrequency(issues);
        const chartData = this.issueAnalyticsService.getChartData(frequencyMap);
        this.generateIssueChartData(chartData.labels, chartData.data);
      }),
      catchError((error) => {
        console.error('Error loading issues', error);
        return EMPTY;
      })
    ).subscribe();
  }

  generateIssueChartData(labels: string[], data: number[]) {
    const documentStyle = getComputedStyle(document.documentElement);

    this.issueChartData = {
      labels,
      datasets: [
        {
          label: 'Tendencias de problemas',
          backgroundColor: documentStyle.getPropertyValue('--red-500'),
          data,
        },
      ],
    };

    this.issueChartOptions = this.fuelAnalyticsService.getChartOptions(documentStyle);
  }

  loadBookings(): void {
    this.bookingService.getAllBookings().subscribe((bookings) => {
      this.bookings = bookings;
      this.updateOverviewCards();
    });
  }

  loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe((vehicles) => {
      this.vehicles = vehicles;
      this.updateOverviewCards();
    });
  }

  loadCustomers(): void {
    this.customerService.getContacts().subscribe((customers) => {
      this.customers = customers;
      this.updateOverviewCards();
    });
  }

  updateOverviewCards(): void {
    this.overviewCards = [
      { value: this.customers.length, label: 'Clientes registrados', icon: 'pi pi-user' },
      { value: this.vehicles.length, label: 'Vehículos registrados', icon: 'pi pi-car' },
      { value: this.bookings.length, label: 'Reservas en el último mes', icon: 'pi pi-calendar' },
    ];
  }

  toggleChart() {
    this.isFuelChart = !this.isFuelChart;
  }
}
