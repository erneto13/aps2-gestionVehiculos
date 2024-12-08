import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingResponse } from '../../../../../core/interfaces/booking';
import { SharedService } from '../../../../../core/services/shared.service';
import { BookingsService } from '../../../../bookings/services/bookings.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-fleet-tracking',
  standalone: true,
  imports: [],
  templateUrl: './fleet-tracking.component.html',
})
export class FleetTrackingComponent implements OnInit, OnDestroy {
  bookings: BookingResponse[] = [];
  currentLocalTime: string = '';
  private timerId: any;

  constructor(
    private sharedService: SharedService,
    private bookingService: BookingsService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.startRealTimeClock();

    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getOnGoingBookings().subscribe({
      next: (response) => {
        this.bookings = response;
      },
      error: (error) => {
        this.toastService.showToast(
          'Error al cargar las rutas',
          'No se lograron cargar las rutas correctamente',
          'error'
        );
      }
    })
  }























  /*
  * This method is used to start the real-time clock
  */

  startRealTimeClock(): void {
    this.timerId = setInterval(() => {
      this.currentLocalTime = this.sharedService.getMySQLTimestamp();
    }, 1000);
  }

  clearRealTimeClock(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  ngOnDestroy(): void {
    this.clearRealTimeClock();
  }
}
