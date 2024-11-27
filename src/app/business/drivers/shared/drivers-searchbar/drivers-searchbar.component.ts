import { Component, EventEmitter, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-drivers-searchbar',
  standalone: true,
  imports: [],
  templateUrl: './drivers-searchbar.component.html',
})
export class DriversSearchbarComponent {
  @Output() search = new EventEmitter<string>();
  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.search.emit(searchTerm);
    });
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }
}