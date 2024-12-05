import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MediaService } from '../../../../core/services/media.service';
import { IssuesService } from '../../services/issues.service';
import { ToastService } from '../../../../core/services/toast.service';
import { SharedService } from '../../../../core/services/shared.service';
import { Issue, IssueType } from '../../../../core/interfaces/issues';
import { Auth } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-issues-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './issues-form.component.html',
})
export class IssuesFormComponent implements OnInit {
  issueForm!: FormGroup;

  uploadedFiles: File[] = [];
  previewUrls: string[] = []; 
  driverName: string | null = null;

  issuesType = Object.values(IssueType);

  constructor(
    private auth: Auth,
    private fb: FormBuilder,
    private mediaService: MediaService,
    private issueService: IssuesService,
    private toastService: ToastService,
    private sharedService: SharedService
  ) {
    this.issueForm = this.fb.group({
      title: ['', [Validators.required, Validators.nullValidator]],
      description: ['', [Validators.required, Validators.nullValidator]],
      selectedIssueType: ['', Validators.required],
      evidenceValidation: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getDriverName();
  }

  onSubmit(): void {
    if (this.issueForm.invalid) {
      this.toastService.showToast(
        'Error',
        'Por favor, rellene todos los campos',
        'error'
      );
      return;
    }

    if (this.uploadedFiles.length > 0) {
      const formData = new FormData();
      this.uploadedFiles.forEach((file) => {
        formData.append('files', file);
      });

      this.mediaService.uploadFile(formData).subscribe({
        next: (response) => {
          if (response.urls && Array.isArray(response.urls)) {
            const rawDate = this.sharedService.getMySQLTimestamp();

            const issue: Issue = {
              title: this.issueForm.value.title,
              description: this.issueForm.value.description,
              issueType: this.issueForm.value.selectedIssueType,
              status: 'PENDING',
              evidence: response.urls,
              reportedBy: this.driverName ?? 'Administrador',
              reportDate: rawDate,
            };

            this.createIssue(issue); 
          }
        },
        error: () => {
          this.toastService.showToast(
            'Error al subir imágenes',
            'Hubo un problema al cargar las imágenes. Inténtelo de nuevo.',
            'error'
          );
        }
      });
    } else {
      this.toastService.showToast(
        'Error',
        'Debe seleccionar al menos una imagen antes de enviar el formulario.',
        'error'
      );
    }
  }

  createIssue(issue: Issue) {
    this.issueService.pushIssue(issue).subscribe({
      next: () => {
        this.toastService.showToast(
          'Asunto creado',
          'Se ha creado el asunto correctamente',
          'success'
        );
        this.issueService.notifyIssueCreated();
        this.issueForm.reset();
        this.uploadedFiles = []; 
        this.previewUrls = []; 
      },
      error: () => {
        this.toastService.showToast(
          'Ha ocurrido un error',
          'Hubo un problema al crear el asunto.',
          'error'
        );
      }
    });
  }

  upload(event: any) {
    const files: FileList = event.target.files;

    if (files && files.length > 0) {
      Array.from(files).forEach((file: File) => {
        this.uploadedFiles.push(file);

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrls.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });

      this.toastService.showToast(
        'Archivos cargados',
        'Las imágenes se han seleccionado correctamente.',
        'success'
      );

      this.issueForm.patchValue({
        evidenceValidation: 'valid'
      });
    } else {
      this.issueForm.patchValue({
        evidenceValidation: ''
      });
    }
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);

    if (this.uploadedFiles.length === 0) {
      this.issueForm.patchValue({
        evidenceValidation: ''
      });
    }
  }

  getDriverName(): void {
    this.driverName = this.auth.getDriverName();
  }
}