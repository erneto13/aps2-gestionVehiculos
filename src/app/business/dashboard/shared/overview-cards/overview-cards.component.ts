import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { OverviewCard } from '../../../../core/interfaces/utils';

@Component({
  selector: 'app-overview-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview-cards.component.html',
})
export class OverviewCardsComponent {
  @Input() cards: OverviewCard[] = [
    { value: 2340, label: 'New products this week', percentage: 14.6, trend: 'up' },
    { value: 5355, label: 'Visitors this week', percentage: 32.9, trend: 'up' },
    { value: 385, label: 'User signups this week', percentage: 2.7, trend: 'down' }
  ];
}
