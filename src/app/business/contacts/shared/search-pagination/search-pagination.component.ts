import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex m-2">
      <div class="w-full px-4 py-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b">
        <div class="flex flex-wrap items-center gap-2">
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <i class="pi pi-search"></i>
            </span>
            <input [(ngModel)]="search" (input)="onSearch()" type="search" placeholder="Buscar por teléfono"
              class="w-[230px] pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-slate-300 text-sm text-gray-600">
          </div>
        </div>

        <div class="flex items-center gap-2">
          <div class="flex items-center space-x-2">
            <button (click)="prevPage()" [disabled]="currentPage === 1"
              class="h-8 w-8 flex items-center justify-center rounded-md border border-gray-300 bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span class="font-medium text-gray-500">
              Página {{ currentPage }} - {{ endIndex }} de {{ totalItems }}
            </span>

            <button (click)="nextPage()" [disabled]="currentPage === totalPages"
              class="h-8 w-8 flex items-center justify-center rounded-md border border-gray-300 bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SearchPaginationComponent {
  @Input() currentPage = 1;
  @Input() totalItems = 0;
  @Input() totalPages = 1;
  @Input() endIndex = 0;
  @Output() pageChange = new EventEmitter<number>();
  @Output() searchChange = new EventEmitter<string>();

  search = '';

  prevPage() {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  onSearch() {
    this.searchChange.emit(this.search);
  }
}