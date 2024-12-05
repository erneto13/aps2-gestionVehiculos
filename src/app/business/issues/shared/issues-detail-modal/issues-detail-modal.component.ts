// Bodriular
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Core
import { Issues } from '../../../../core/interfaces/issues';
import { IssuesUpdateFormComponent } from '../issues-update-form/issues-update-form.component';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-issues-detail-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, DatePipe, ReactiveFormsModule,
    InputTextareaModule, IssuesUpdateFormComponent],
  templateUrl: './issues-detail-modal.component.html',
})
export class IssuesDetailModalComponent {
  @Input({ required: true }) issue!: Issues;
  @Input() userRole: string | null = null;
  @Input() modalData: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() reloadIssues = new EventEmitter<void>();
  currentSlide = 0;

  setSlide(index: number): void {
    this.currentSlide = index;
  }
  
  onHide(): void {
    this.modalData = false;
    this.currentSlide = 0;
    this.closeModal.emit();
  }

  _closeModal() {
    this.modalData = false;
    this.reloadIssues.emit();
  }
}
