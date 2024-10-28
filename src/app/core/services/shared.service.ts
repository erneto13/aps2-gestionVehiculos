import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private titleSource = new BehaviorSubject<string>('Panel');
  currentTitle = this.titleSource.asObservable();

  constructor() {}

  changeTitle(title: string) {
    this.titleSource.next(title);
  }
}
