import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private lSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.lSubject.asObservable();

  show() {
    this.lSubject.next(true);
    console.log('mostrando spinner');
  }

  hide() {
    this.lSubject.next(false);
    console.log('ocultando spinner');
  }
}
