import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Drivers } from '../../../../core/interfaces/drivers';

@Component({
  selector: 'app-drivers-table',
  standalone: true,
  imports: [],
  templateUrl: './drivers-table.component.html',
})
export class DriversTableComponent {
  @Input() drivers: Drivers[] = [];
  tableHeaders: string[] = ['Nombre', 'Licencia', 'Categoría', 'Teléfono', 'Dirección', 'Acciones'];
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<Drivers>();

  deleteDriver(id: number): void {
    this.delete.emit(id);
  }

  editDriver(driver: Drivers): void {
    this.edit.emit(driver);
  }
}
