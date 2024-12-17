import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contacts } from '../../../../core/interfaces/contacts';

@Component({
  selector: 'app-client-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-x-auto rounded-lg border border-gray-200">
      <div class="overflow-y-auto max-h-[400px]">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              @for (column of columns; track $index) {
              <th scope="col"
                  class="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 shadow"
                  style="white-space: nowrap; width: 200px;"> 
                  {{ column }}
              </th>
              }
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            @if (contacts.length > 0) {
            @for (contact of contacts; track $index) {
            <tr class="hover:bg-gray-100 cursor-pointer">
              <td class="px-6 py-4 text-sm font-medium text-slate-900" style="width: 200px; white-space: nowrap;">
                  {{ contact.name }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500" style="width: 200px; white-space: wrap;">
                  {{ contact.company }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500" style="width: 300px; max-height: 100px; overflow-y: auto;">
                  {{ contact.phone }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500" style="width: 300px; max-height: 100px; overflow-y: auto;">
                  {{ contact.email }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500" style="width: 300px; max-height: 100px; overflow-y: auto;">
                  {{ contact.service }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500" style="width: 200px; white-space: wrap;">
                <span [class]="'inline-flex px-2 py-1 text-xs font-semibold rounded-full ' + 
                (contact.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')">
                  {{ contact.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                <div class="flex gap-2">
                    <i class="pi pi-eye text-blue-500 text-xl cursor-pointer mr-4" (click)="editClient(contact)"
                        title="Ver detalles">
                    </i>
                    <i class="pi pi-trash text-red-500 text-xl cursor-pointer" (click)="deleteContact(contact.contact_id!)"
                        title="Eliminar">
                    </i>
                </div>
            </td>
            </tr>
            }
            } @else {
            <tr>
              <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                <div class="flex flex-col items-center">
                  <i class="pi pi-info-circle text-4xl text-gray-400 mb-2"></i>
                  <p class="text-xl font-medium text-gray-600">No hay datos disponibles</p>
                  <p class="text-sm text-gray-400">No se ha encontrado ningún cliente</p>
                </div>
              </td>
            </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ClientTableComponent {
  @Input() contacts: any[] = [];
  @Input() columns: string[] = [];
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<Contacts>();


  deleteContact(id: number): void {
    this.delete.emit(id);
  }

  editClient(contact: Contacts): void {
    this.edit.emit(contact);
  }
}
