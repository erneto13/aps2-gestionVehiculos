// Bodriular
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Core
import { ContactsService } from '../../services/contacts.service';
import { ClientResponse } from '../../../../core/interfaces/contacts';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-form.component.html',
})
export class ClientFormComponent implements OnInit {
  @Output() clientCreated = new EventEmitter<void>();
  clientForm!: FormGroup;

  constructor(private fb: FormBuilder, private contactService: ContactsService) {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required]],
      company: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      service: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {

  }

  onSubmitContact(): void {
    if (this.clientForm.invalid) {
      console.error('Form is invalid');
      return;
    }

    const clientResponse: ClientResponse = {
      name: this.clientForm.value.name,
      company: this.clientForm.value.company,
      phone: this.clientForm.value.phone,
      email: this.clientForm.value.email,
      service: this.clientForm.value.service,
      status: 'Activo',
    };
    this.addContact(clientResponse);
  }

  addContact(clientResponse: ClientResponse): void {
    this.contactService.addContact(clientResponse).subscribe(() => {
      this.clientCreated.emit();
      this.clientForm.reset();
    });
  }

}
