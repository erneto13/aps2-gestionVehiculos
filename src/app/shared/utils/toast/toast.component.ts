// toast.component.ts
import { Component, OnInit } from '@angular/core';
import { ToastMessage, ToastService } from '../../../core/services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-toast',
  imports: [CommonModule],
  styles: [`
    .toast-container {
      position: fixed;
      z-index: 9999; /* Highest z-index to ensure it's on top */
      top: 0;
      left: 0;
      right: 0;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
    }

    .toast-item {
      max-width: 24rem;
      width: 100%;
      pointer-events: auto;
      margin-bottom: 0.5rem;
    }
  `],
  template: `
    <div class="toast-container">
      @for (toast of toasts; track $index) {  
        <div
          class="toast-item overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 transform transition"
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
}