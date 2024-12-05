import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Issues, IssueUpdate } from '../../../../core/interfaces/issues';
import { IssuesService } from '../../services/issues.service';
import { SharedService } from '../../../../core/services/shared.service';
import { Auth } from '../../../../core/services/auth.service';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-issues-update-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextareaModule],
  templateUrl: './issues-update-form.component.html',
})
export class IssuesUpdateFormComponent {
  @Input({ required: true }) issue!: Issues;
  @Output() issueUpdated = new EventEmitter<void>();

  updateIssues!: FormGroup;
  driverName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private issueService: IssuesService,
    private toastService: ToastService,
    private sharedService: SharedService,
    private authService: Auth
  ) {
    this.updateIssues = this.fb.group({
      comments: ['', [Validators.required, Validators.nullValidator]]
    });

    this.driverName = this.authService.getDriverName();
  }

  updateIssueStatus(id: number | undefined, status: string): void {
    if (id === undefined) {
      console.error('ID no definido');
      return;
    }
    this.issueService.updateStatusIssue(id, status).subscribe({
      next: () => {
        this.toastService.showToast(
          'Éxito',
          'Asunto actualizado correctamente',
          'success'
        );
        this.issueUpdated.emit();
      },
      error: (error: any) => {
        this.toastService.showToast(
          'Error',
          'No se pudo actualizar el asunto',
          'error'
        );
      }
    });
  }

  updateIssueComplete(): void {
    if (this.updateIssues.valid && this.issue?.issues_id) {
      const currentTimestamp = this.sharedService.getMySQLTimestamp();

      const issueAttributes: IssueUpdate = {
        issues_id: this.issue.issues_id,
        status: 'CLOSED',
        resolvedBy: this.driverName ?? 'Administrador',
        resolvedDate: currentTimestamp,
        comments: this.updateIssues.value.comments,
      };

      this.issueService.updateIssueResolution(issueAttributes).subscribe({
        next: () => {
          this.toastService.showToast(
            'Éxito',
            'Asunto actualizado correctamente',
            'success'
          );

          this.updateIssues.reset();
          this.issueUpdated.emit();
        },
        error: (errorMessage: any) => {
          this.toastService.showToast(
            'Error',
            'Error al actualizar el asunto',
            'error'
          );
        }
      });
    } else {
      this.toastService.showToast(
        'Advertencia',
        'Por favor complete todos los campos requeridos',
        'info'
      );
    }
  }

  deleteIssue(id: number) {
    this.issueService.deleteIssue(id).subscribe({
      next: () => {
        this.toastService.showToast(
          'Éxito',
          'Asunto eliminado correctamente',
          'success'
        );
        this.issueUpdated.emit();
      },
      error: (error: any) => {
        this.toastService.showToast(
          'Error',
          'No se pudo eliminar el asunto',
          'error'
        );
      }
    });
  }
}
