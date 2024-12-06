import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserDriver } from '../../../../core/interfaces/drivers';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-settings-table',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './settings-table.component.html',
})
export class SettingsTableComponent {
  @Input() relationUD: UserDriver[] = [];
  tableHeaders: string[] = ['Usuario', 'Rol', 'Acciones'];
  @Output() delete = new EventEmitter<number>();

  deleteRelation(id: number): void {
    this.delete.emit(id);
  }

  editRelation(relation: UserDriver): void {
  }
}
