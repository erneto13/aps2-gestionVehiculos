import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-drivers-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drivers-pagination.component.html',
})
export class DriversPaginationComponent {
  @Input() currentPage = 0;
  @Input() totalPages = 0;
  @Output() pageChange = new EventEmitter<number>();

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i);
  }

  getVisiblePages(currentPage: number, totalPages: number): number[] {
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(0, currentPage - half);
    let end = Math.min(totalPages - 1, currentPage + half);

    if (currentPage - half < 0) {
      end = Math.min(totalPages - 1, end + (half - currentPage));
    }
    if (currentPage + half > totalPages - 1) {
      start = Math.max(0, start - ((currentPage + half) - (totalPages - 1)));
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }


  onPageClick(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
