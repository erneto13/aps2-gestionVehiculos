import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BookingResponse } from '../../../../../core/interfaces/booking';
import { BookingsService } from '../../../../bookings/services/bookings.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { SharedService } from '../../../../../core/services/shared.service';
import { RouteTrackingService } from '../../../services/route-tracking.service';
import { interval, Subscription } from 'rxjs';
import { RoutePoint } from '../../../../../core/interfaces/geofence';
import { DirectionsApiClient } from '../../../../bookings/maps/api/directionsApiClient';
import { DirectionsResponse } from '../../../../../core/interfaces/directions';

@Component({
  selector: 'app-fleet-details',
  standalone: true,
  templateUrl: './fleet-details.component.html',
})
export class FleetDetailsComponent implements OnChanges {
  @Input() booking: BookingResponse | null = null;
  @Output() boookingCancelled = new EventEmitter<void>();

  isBookingExpired: boolean = false;
  timeRemainingMessage: string = '';

  private pollingSubscription: Subscription | null = null;
  currentLocation: RoutePoint | null = null;
  coordinates!: [number, number][];

  constructor(
    private bookingService: BookingsService,
    private toastService: ToastService,
    private sharedService: SharedService,
    private routeService: RouteTrackingService,
    private directionsApi: DirectionsApiClient
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['booking'] && changes['booking'].currentValue) {
      this.stopRoute();

      const currentDate = new Date();
      const endDate = this.booking?.end_date ? new Date(this.booking.end_date) : null;

      if (endDate) {
        if (currentDate > endDate) {
          this.isBookingExpired = true;
        } else {
          this.isBookingExpired = false;
          this.timeRemainingMessage = this.sharedService.calculateTimeRemaining(currentDate, endDate);
        }
      }
    }
  }

  startRoute(): void {
    if (!this.booking) throw new Error('Booking not found');

    if (
      this.booking.origin_lat != null &&
      this.booking.origin_lng != null &&
      this.booking.destination_lat != null &&
      this.booking.destination_lng != null
    ) {
      const origin: [number, number] = [this.booking.origin_lng, this.booking.origin_lat];
      const destination: [number, number] = [this.booking.destination_lng, this.booking.destination_lat];

      this.getCoordinates(origin, destination)
        .then((coordinates) => {
          this.coordinates = coordinates;

          this.routeService.startRoute(this.booking!.bookings_id, this.coordinates).subscribe({
            next: () => {
              this.bookingService.updateBookingStatus(this.booking!.bookings_id, 'ON_GOING').subscribe({
                next: () => {
                  const data = {
                    bookingId: this.booking!.bookings_id,
                    originLat: this.booking!.origin_lat,
                    originLng: this.booking!.origin_lng,
                    destinationLat: this.booking!.destination_lat,
                    destinationLng: this.booking!.destination_lng,
                  };
                  this.routeService.triggerStartRoute(data);

                  this.toastService.showToast(
                    'Ruta iniciada',
                    'La ruta ha sido iniciada correctamente.',
                    'success'
                  );
                  this.boookingCancelled.emit();
                },
                error: () => {
                  this.toastService.showToast(
                    'Error al iniciar la ruta',
                    'Hubo un problema al cambiar el estado del booking. Por favor, inténtelo de nuevo más tarde.',
                    'error'
                  );
                },
              });
            },
            error: () => {
              this.toastService.showToast(
                'Error al iniciar la simulación',
                'No se pudo iniciar la simulación de la ruta. Por favor, inténtelo de nuevo más tarde.',
                'error'
              );
            },
          });
        })
        .catch((err) => {
          this.toastService.showToast(
            'Error al obtener las coordenadas',
            `No se pudo obtener la ruta entre los puntos: ${err}`,
            'error'
          );
        });
    } else {
      this.toastService.showToast(
        'Error al iniciar la ruta',
        'Las coordenadas de origen o destino no están disponibles.',
        'error'
      );
    }
  }

  cancelRoute(): void {
    if (!this.booking) throw new Error('Booking not found');

    this.bookingService.updateBookingStatus(this.booking.bookings_id, 'CANCELLED').subscribe({
      next: () => {
        this.toastService.showToast(
          'Reserva cancelada',
          'Se ha cancelado la reserva, el administrador ha sido notificado.',
          'info'
        );
        this.boookingCancelled.emit();
      },
      error: (err) => {
        this.toastService.showToast(
          'Error al cancelar la reserva',
          'Hubo un problema al cancelar la reserva. Por favor, inténtelo de nuevo más tarde.',
          'error'
        );
      },
    });
  }

  stopRoute(): void {
    this.pollingSubscription?.unsubscribe();
  }

  private getCoordinates(origin: [number, number], destination: [number, number]): Promise<[number, number][]> {
    return new Promise((resolve, reject) => {
      this.directionsApi
        .get<DirectionsResponse>(`/${origin.join(',')};${destination.join(',')}`)
        .subscribe({
          next: (response) => {
            const firstRoute = response.routes[0];
            if (firstRoute) {
              const coordinates = firstRoute.geometry.coordinates.map(coord => {
                if (coord.length === 2) return coord as [number, number];
                throw new Error('formato no correcto');
              });
              resolve(coordinates);
            } else {
              reject('ruta no válida');
            }
          },
          error: (err) => reject(err),
        });
    });
  }
}