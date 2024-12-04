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
      <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      @for (toast of toasts; track $index) {  
      <div
          
          class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 transform transition"
          [ngClass]="[
            'animate-fadeIn',
            exitingIndexes.includes($index) ? 'animate-fadeOut' : ''
          ]"
          (animationend)="onAnimationEnd($index)"
          style="background: rgba(255, 255, 255, 0.9)"
        >
      
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
              <i
                  [ngClass]="getIconClass(toast.type)"
                  class="mr-2"
                  [ngStyle]="{ color: getToastColor(toast.type) }"
                ></i>
              </div>
              <div class="ml-3 w-0 flex-1">
                <p class="text-sm font-medium text-gray-900">{{ toast.title }}</p>
                <p class="mt-1 text-sm text-gray-500">{{ toast.message }}</p>
              </div>
              <div class="ml-4 flex-shrink-0">
                <button
                  type="button"
                  class="inline-flex rounded-md bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none"
                  (click)="startExitAnimation($index)"
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
  exitingIndexes: number[] = [];

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.toastService.toast$.subscribe((toast) => {
      this.toasts.push(toast);
      const index = this.toasts.length - 1;
      setTimeout(() => this.startExitAnimation(index), 3000);
    });
  }

  startExitAnimation(index: number): void {
    this.exitingIndexes.push(index);
  }

  onAnimationEnd(index: number): void {
    if (this.exitingIndexes.includes(index)) {
      this.exitingIndexes = this.exitingIndexes.filter((i) => i !== index);
      this.toasts.splice(index, 1);
    }
  }

  getToastColor(type: 'success' | 'error' | 'info'): string {
    return {
      success: 'green',
      error: 'red',
      info: 'blue',
    }[type];
  }

  getIconClass(type: 'success' | 'error' | 'info'): string {
    return {
      success: 'pi pi-check',
      error: 'pi pi-times',
      info: 'pi pi-info',
    }[type];
  }

  trackByIndex(index: number): number {
    return index;
  }
}
