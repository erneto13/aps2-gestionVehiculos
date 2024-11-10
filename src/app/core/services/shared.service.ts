import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  titleSource = new BehaviorSubject<string>('Panel');
  currentTitle = this.titleSource.asObservable();

  changeTitle(title: string) {
    this.titleSource.next(title);
  }
}
