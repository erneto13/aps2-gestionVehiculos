// Bodriular
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

// Core
import { Issues } from '../../../../core/interfaces/issues';
import { TruncatePipe } from '../../../../core/pipes/truncate.pipe';
import { FormatEnumPipe } from '../../../../core/pipes/format.pipe';

@Component({
  selector: 'app-issues-card',
  standalone: true,
  imports: [TruncatePipe, CommonModule, FormatEnumPipe],
  templateUrl: './issues-card.component.html',
})
export class IssuesCardComponent {
  @Input({ required: true }) issue!: Issues;
  @Output() cardClick = new EventEmitter<Issues>();

  onCardClick(): void {
    this.cardClick.emit(this.issue);
  }
}
