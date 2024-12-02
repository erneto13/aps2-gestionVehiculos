import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Auth } from '../../core/services/auth.service';

import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { BookingsService } from '../bookings/services/bookings.service';
import { BookingResponse } from '../../core/interfaces/booking';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CardModule,
    ChartModule, DatePipe],
  templateUrl: './dashboard.component.html',
})
export default class DashboardComponent {

  data: any;
  options: any;

  bookings: BookingResponse[] = [];

  constructor(
    private auth: Auth,
    private bookingService: BookingsService
  ) { }

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: ['Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets: [
        {
          label: 'Dataset 1',
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          yAxisID: 'y',
          tension: 0.4,
          data: [65, 59, 80, 81, 56, 55, 10]
        },
        {
          label: 'Dataset 2',
          fill: false,
          borderColor: documentStyle.getPropertyValue('--green-500'),
          yAxisID: 'y1',
          tension: 0.4,
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    };

    this.options = {
      stacked: false,
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          ticks: {
            color: textColorSecondary
          },
          grid: {
            drawOnChartArea: false,
            color: surfaceBorder
          }
        }
      }
    };

    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getAllBookings().subscribe((bookings: BookingResponse[]) => {
      this.bookings = bookings;
    });
  }
}
