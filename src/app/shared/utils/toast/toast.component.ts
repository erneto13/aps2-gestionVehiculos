// toast.component.ts
import { Component, OnInit } from '@angular/core';
import { ToastMessage, ToastService } from '../../../core/services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-toast',
  imports: [CommonModule],
  template: `
    <div
      aria-live="assertive"
      class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div class="flex w-50 flex-col items-center space-y-4 sm:items-end">
        @for (toast of toasts; track $index) {
          <div
            class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 transform transition"
            [ngClass]="getToastClass(toast.type)"
            style="background: rgba(255, 255, 255, 0.9)"
          >
            <div class="p-4">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  @if (toast.type === 'success') {
                    <i class="pi pi-check mr-2" style="color: green"></i>
                  }
                  @if (toast.type === 'error') {
                    <i class="pi pi-times mr-2" style="color: red"></i>
                  }
                  @if (toast.type === 'info') {
                    <i class="pi pi-info mr-2" style="color: blue"></i>
                  }
                </div>
                <div class="ml-3 w-0 flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ toast.title }}</p>
                  <p class="mt-1 text-sm text-gray-500">{{ toast.message }}</p>
                </div>
                <div class="ml-4 flex-shrink-0">
                  <button
                    type="button"
                    class="inline-flex rounded-md bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none"
                    (click)="removeToast(toast)"
                  >
                    <i class="pi pi-times"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class ToastComponent implements OnInit {
  toasts: ToastMessage[] = [];

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.toastService.toast$.subscribe((toast) => {
      this.toasts.push(toast);
      setTimeout(() => this.removeToast(toast), 3000);
    });
  }

  removeToast(toast: ToastMessage) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  getToastClass(type: 'success' | 'error' | 'info') {
    return {
      success: 'translate-z-0 opacity-100 sm:translate-x-0',
      error: 'translate-z-0 opacity-100 sm:translate-x-0',
      info: 'translate-z-0 opacity-100 sm:translate-x-0',
    }[type];
  }
}
