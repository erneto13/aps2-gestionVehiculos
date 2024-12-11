// Bodriular
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// COre
import { BookingResponse, RouteDetails } from '../../../../../core/interfaces/booking';
import { SharedService } from '../../../../../core/services/shared.service';
import { BookingsService } from '../../../../bookings/services/bookings.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { Auth } from '../../../../../core/services/auth.service';
import { FleetSearchComponent } from '../fleet-search/fleet-search.component';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { FleetDetailsComponent } from '../../../shared/components/fleet-details/fleet-details.component';
import { RouteTrackingService } from '../../../services/route-tracking.service';

@Component({
  selector: 'app-fleet-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule,
    FleetSearchComponent, DialogModule, FleetDetailsComponent],
  templateUrl: './fleet-tracking.component.html',
})
export class FleetTrackingComponent implements OnInit, OnDestroy {
  bookings: BookingResponse[] = [];
  selectedBooking: BookingResponse | null = null;
  userRole: 'admin' | 'driver' = 'driver';
  driverName!: string;

  // Reloj
  currentLocalTime: string = '';
  private timerId: any;

  // Para el buscador
  searchTerm: string = '';
  filteredBookings: BookingResponse[] = [];

  // test
  visible: boolean = false;

  constructor(
    private sharedService: SharedService,
    private bookingService: BookingsService,
    private toastService: ToastService,
    private authService: Auth,
    private routeService: RouteTrackingService
  ) { }

  ngOnInit(): void {
    this.startRealTimeClock();
    this.determineUserRole();
    this.loadBookings();
  }

  determineUserRole(): void {
    const role = this.authService.getUserRole();
    this.userRole = role === 'admin' ? 'admin' : 'driver';

    if (this.userRole === 'driver') {
      this.driverName = this.authService.getDriverName() || '';

      if (!this.driverName) {
        this.toastService.showToast(
          'Error al cargar las rutas',
          'No se logró conseguir el nombre del conductor',
          'error'
        );
      }
    }
  }

  loadBookings(): void {
    this.visible = false;

    if (this.userRole === 'admin') {
      this.loadOnGoingBookings();
    } else {
      this.loadDriverBookings();
    }
  }

  loadOnGoingBookings(): void {
    this.bookingService.getOnGoingBookings().subscribe({
      next: (response) => {
        this.bookings = response;
        this.filteredBookings = response;
      },
      error: (error) => {
        this.toastService.showToast(
          'Error al cargar las rutas',
          'No se lograron cargar las rutas correctamente',
          'error'
        );
      }
    });
  }

  loadDriverBookings(): void {
    if (!this.driverName) return;

    this.bookingService.getBookingsByDriverName(this.driverName).subscribe({
      next: (response) => {
        this.bookings = response;
        this.filteredBookings = response;
      },
      error: (error) => {
        this.toastService.showToast(
          'Error al cargar las rutas',
          'No se lograron cargar las rutas correctamente',
          'error'
        );
      }
    });
  }

  handleSearchChange(term: string): void {
    this.filteredBookings = this.bookings.filter((booking) =>
      booking.vehicle.brand.toLowerCase().includes(term.toLowerCase()) ||
      booking.vehicle.license_plate.toLowerCase().includes(term.toLowerCase())
    );
  }

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

  /*
  Logica para cuando el conductor inicia la ruta
  Lógica para cuando el admin quiere ver la ruta
  */

  // Método para iniciar la ruta (VISTA DRIVER)
  initializeRoute(booking: BookingResponse) {
    this.visible = true;
    this.selectedBooking = booking;
  }

  // Método para ver los detalles de la ruta (VISTA ADMIN)
  viewRouteDetails(booking: BookingResponse) {
    this.selectedBooking = booking;

    this.routeService.getCurrentLocation(booking.bookings_id).subscribe({
      next: (response) => {
        console.log(response.latitude, response.longitude);
        this.toastService.showToast(
          'Ubicación actual cargada',
          'Se cargó la ubicación actual del vehículo',
          'success'
        )
      },
      error: (error) => {
        this.toastService.showToast(
          'Error al cargar la ubicación actual',
          'No se logró cargar la ubicación actual del vehículo',
          'error'
        );
      }
    })
  }

  ngOnDestroy(): void {
    this.clearRealTimeClock();
  }
}