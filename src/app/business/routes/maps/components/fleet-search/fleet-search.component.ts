import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fleet-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './fleet-search.component.html',
})
export class FleetSearchComponent {
  @Input() placeholder: string = 'Buscar...';
  @Output() searchChange = new EventEmitter<string>();
  searchTerm: string = '';

  onSearch(): void {
    this.searchChange.emit(this.searchTerm);
  }
}
