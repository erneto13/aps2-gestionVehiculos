// Bodriular
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Core & Shared
import { Auth } from '../../../../core/services/auth.service';
import { MediaService } from '../../../../core/services/media.service';
import { ButtonComponent } from "../../../../shared/utils/button/button.component";
import { IssueType, NewIssues } from '../../../../core/interfaces/issues';
import { SharedService } from '../../../../core/services/shared.service';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { IssuesService } from '../../services/issues.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-issues-header',
  standalone: true,
  imports: [TitleCasePipe, ButtonComponent, DialogModule, InputTextareaModule,
    DropdownModule, CommonModule, ReactiveFormsModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './issues-header.component.html',
  styleUrl: './issues-header.component.css'
})
export class IssuesHeaderComponent implements OnInit {
  @Input() issueType: string = '';
  visible: boolean = false;

  newIssueForm: FormGroup
  userName: string | null = null;
  listOfTimes: Date[] = [];
  uploadedFiles: string[] = [];

  constructor(private fb: FormBuilder,
    private auth: Auth, private ms: MediaService, 
    private is: IssuesService, private msgs: MessageService,
    private shared: SharedService
  ) {
    this.newIssueForm = this.fb.group({
      title: ['', [Validators.required, Validators.nullValidator]],
      description: ['', [Validators.required, Validators.nullValidator]],
      selectedIssueType: ['', Validators.required],
      evidenceValidation: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      if (user) {
        this.userName = user?.name;
      }
    })
  }

  pushIssue() {
    if (this.newIssueForm.valid && this.uploadedFiles.length > 0) {
      const currentTimestamp = this.shared.getMySQLTimestamp();

      const issueAttributes: NewIssues = {
        title: this.newIssueForm.value.title,
        description: this.newIssueForm.value.description,
        issue_type: this.newIssueForm.value.selectedIssueType,
        status: 'PENDING',
        evidence: this.uploadedFiles,
        reportedBy: this.userName ?? 'Unknown',
        reportDate: currentTimestamp,
        resolvedBy: null,
        resolvedDate: null,
        comments: null,
      };
      this.is.pushIssue(issueAttributes).subscribe({
        next: (response) => {
          this.msgs.add({
            severity: 'success',
            summary: 'Asunto creado exitosamente',
            detail: 'Se agregó tu asunto a la lista.',
          });
          this.newIssueForm.reset();
          this.uploadedFiles = [];
          this.visible = false;
        },
        error: (error) => {
          this.msgs.add({
            severity: 'error',
            summary: 'Error al crear asunto',
            detail: error.message || 'Hubo un problema al crear el asuntp.',
          });
        }
      })
    }
  }

  openCreateIssueModal() {
    this.visible = true;
  }

  issueTypes = Object.keys(IssueType).filter((key) => isNaN(Number(key)))
    .map((key) => ({ label: this.titleCase(key), value: key }));

  titleCase(str: string): string {
    return str.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  }

  get canSubmit(): boolean {
    return this.newIssueForm.valid && this.uploadedFiles.length > 0;
  }

  upload(event: any) {
    const files: FileList = event.target.files;

    if (files && files.length > 0) {
      const formData = new FormData();

      Array.from(files).forEach((file: File) => {
        formData.append('files', file);
      });

      this.ms.uploadFile(formData).subscribe({
        next: (response) => {
          this.msgs.add({
            severity: 'success',
            summary: 'Archivos subidos',
            detail: 'Los archivos fueron subidos exitosamente.',
          }); if (response.urls && Array.isArray(response.urls)) {
            this.uploadedFiles = response.urls;
            this.newIssueForm.patchValue({
              evidenceValidation: 'valid'
            });
          }
        },
        error: (error) => {
          console.error('Error al subir archivos:', error);
          this.newIssueForm.patchValue({
            evidenceValidation: ''
          });
        }
      });
    } else {
      this.newIssueForm.patchValue({
        evidenceValidation: ''
      });
    }
  }
}
