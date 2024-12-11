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
  totalContacts!: number;

  @Input() cards: OverviewCard[] = [
    { value: this.totalContacts, label: 'Contactos registrados', percentage: 14.6, trend: 'up' },
    { value: 5355, label: 'Visitors this week', percentage: 32.9, trend: 'up' },
    { value: 385, label: 'User signups this week', percentage: 2.7, trend: 'down' }
  ];

  constructor(
    private contactService: ContactsService
  ) { }

  ngOnInit(): void {
    this.loadCardsValues();
  }

  loadCardsValues(): void {
    this.contactService.getContacts().forEach(() => {
      this.totalContacts++
    })
  }
}
