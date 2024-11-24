import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-client-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold mb-1">Lista de Clientes</h1>
        <p class="text-sm text-gray-500">Encuentra y gestiona tus clientes</p>
      </div>

      <button (click)="onAddContact()"
        class="bg-blue-500 hover:bg-blue-600 text-gray-800 font-medium py-2 px-4 rounded inline-flex items-center">
        <svg class="fill-current w-4 h-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M15 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.73 0-7 2.134-7 4v2h14v-2c0-1.866-3.27-4-7-4zm-9-4h-2v2h2v2h2v-2h2v-2h-2v-2h-2v2z" />
        </svg>
        <span class="font-medium text-white">Agregar contacto</span>
      </button>
    </div>
  `
})
export class ClientHeaderComponent {
  @Output() addContact = new EventEmitter<void>();

  onAddContact() {
    this.addContact.emit();
  }
}