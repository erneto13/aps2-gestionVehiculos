import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { OverviewCard } from '../../../../core/interfaces/utils';
import { ContactsService } from '../../../contacts/services/contacts.service';

@Component({
  selector: 'app-overview-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview-cards.component.html',
})
export class OverviewCardsComponent implements OnInit {
  @Input() cards: OverviewCard[] = [];

  constructor(private contactService: ContactsService) { }

  ngOnInit(): void {
  }
}
