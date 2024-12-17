import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Core
import { ContactsService } from '../../services/contacts.service';
import { ClientResponse, Contacts } from '../../../../core/interfaces/contacts';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-form.component.html',
})
export class ClientFormComponent implements OnInit, OnChanges {
  @Output() clientCreated = new EventEmitter<void>();
  @Input() contact: Contacts | null = null;
  @Output() contactUpdated = new EventEmitter<Contacts>();
  clientForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactsService,
    private toastService: ToastService
  ) {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required]],
      company: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      service: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.contact) {
      this.patchFormWithContact();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contact'] && this.contact) {
      this.patchFormWithContact();
    }
  }

  private patchFormWithContact(): void {
    this.clientForm.patchValue({
      name: this.contact!.name,
      company: this.contact!.company,
      phone: this.contact!.phone,
      email: this.contact!.email,
      service: this.contact!.service,
    });
  }

  onSubmit(): void {
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

    if (this.contact) {
      const updatedContact: Contacts = { ...this.contact, ...clientResponse };
      this.updateContact(updatedContact.contact_id, updatedContact);
    } else {
      this.addContact(clientResponse);
    }
  }

  addContact(clientResponse: ClientResponse): void {
    this.contactService.addContact(clientResponse).subscribe({
      next: () => {
        this.toastService.showToast(
          'Contacto creado',
          'El contacto ha sido creado exitosamente',
          'success'
        );

        this.clientCreated.emit();
        this.clientForm.reset();
      },
      error: (err) => {
        this.toastService.showToast(
          'Ha ocurrido un problema',
          'No se ha logrado crear el contacto',
          'error'
        )
      }
    });
  }

  updateContact(id: number, contact: Contacts): void {
    this.contactService.updateContact(id, contact).subscribe({
      next: (updatedContact) => {
        this.toastService.showToast(
          'Contacto actualizado',
          'El contacto ha sido actualizado exitosamente',
          'success'
        );
        this.contactUpdated.emit(updatedContact);
        this.clientForm.reset();
      },
      error: (err) => {
        this.toastService.showToast(
          'Ha ocurrido un problema',
          'No se ha logrado actualizar el contacto',
          'error'
        );
      }
    });
  }

  toggleClientStatus(): void {
    const newStatus = this.contact!.status === 'Activo' ? 'Inactivo' : 'Activo';
    this.contactService.updateContactStatus(this.contact!.contact_id, newStatus).subscribe({
      next: () => {
        this.toastService.showToast(
          `Cliente ${newStatus.toLowerCase()}`,
          `El cliente ha sido cambiado a ${newStatus.toLowerCase()} exitosamente`,
          'success'
        );
        this.contact!.status = newStatus;
        this.contactUpdated.emit({ ...this.contact! });
      },
      error: (err) => {
        this.toastService.showToast(
          'Ha ocurrido un problema',
          `No se ha logrado cambiar el estado del cliente a ${newStatus.toLowerCase()}`,
          'error'
        );
      }
    });
  }

}