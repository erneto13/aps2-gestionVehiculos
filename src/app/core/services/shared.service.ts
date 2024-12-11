import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SharedService {
  titleSource = new BehaviorSubject<string>('Panel');
  currentTitle = this.titleSource.asObservable();

  private pricingContentSubject = new BehaviorSubject<string>('');
  pricingContent$ = this.pricingContentSubject.asObservable();

  changeTitle(title: string) {
    this.titleSource.next(title);
  }

  updatePricingContent(content: string) {
    this.pricingContentSubject.next(content);
  }

  /**
  * Obtiene el timestamp actual en formato MySQL
  * @returns string en formato 'YYYY-MM-DD HH:mm:ss'
  * Ejemplo: '2024-11-06 10:15:00'
  */
  getMySQLTimestamp(): string {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  /*
  * Convierte un datetime-local a un timestamp MySQL
  * @param datetimeLocal string en formato 'YYYY-MM-DDTHH:mm'
  * @returns string en formato 'YYYY-MM-DD HH:mm:ss'
  * Ejemplo: '2024-11-06T10:15' -> '2024-11-06 10:15:00'
  */
  convertToMySQLTimestamp(datetimeLocal: string): string {
    const date = new Date(datetimeLocal);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes empieza en 0
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * Calcula el tiempo restante entre dos fechas.
   * 
   * @param currentDate - La fecha y hora actual.
   * @param endDate - La fecha y hora de finalización.
   * @returns Una cadena que indica los días, horas y minutos restantes hasta la fecha de finalización.
   */
  calculateTimeRemaining(currentDate: Date, endDate: Date): string {
    const diff = endDate.getTime() - currentDate.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `Quedan ${days}d, ${hours}h y ${minutes}m para la finalización de la ruta.`;
  }
}
