// Bodriular
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Interfaces, Services, Pipes and Directives
import { Issues, IssueUpdate } from '../../../../core/interfaces/issues';
import { IssuesService } from '../../services/issues.service';
import { Auth } from '../../../../core/services/auth.service';
import { TruncatePipe } from '../../../../core/pipes/truncate.pipe';

// PrimeNG
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'app-issues-view',
  standalone: true,
  imports: [CommonModule, DialogModule, TruncatePipe, ImageModule,
    InputTextareaModule, ReactiveFormsModule, MessagesModule
  ],
  providers: [MessageService],
  templateUrl: './issues-view.component.html',
  styleUrl: './issues-view.component.css'
})
export default class IssuesViewComponent implements OnInit {

  issues: Issues[] = [];
  issueType: string = '';
  selectedIssue: Issues | null = null;
  modalData: boolean = false;

  userRole: string | null = null;
  userName: string | null = null;

  updateIssues!: FormGroup;

  constructor(
    private is: IssuesService,
    private activeRoute: ActivatedRoute,
    private authService: Auth,
    private fb: FormBuilder,
    private msgs: MessageService
  ) {
    this.updateIssues = this.fb.group({
      comments: ['', [Validators.required, Validators.nullValidator]],
    })
  }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();

    this.authService.user$.subscribe(user => {
      if (user) {
        this.userName = user.name;
      }

      this.activeRoute.params.subscribe(params => {
        this.issueType = params['issue_type'];
        this.loadIssuesByRoleAndType();
      });
    });
  }

  loadIssuesByRoleAndType(): void {
    if (this.userRole === 'admin') {
      if (this.issueType === 'closed') {
        this.getIssueByStatus('closed');
      } else {
        this.getIssuesByType(this.issueType);
      }
    } else { // rol "driver"
      if (this.issueType === 'closed') {
        if (this.userName) {
          this.is.getClosedIssuesByUser(this.userName).subscribe(issues => {
            this.issues = issues;
          });
        }
      } else {
        if (this.userName) {
          this.is.getIssueByTypePerUser(this.issueType, this.userName).subscribe(issues => {
            this.issues = issues;
          });
        }
      }
    }
  }

  getIssuesByType(issueType: string): void {
    this.is.getIssueByType(issueType).subscribe(issues => {
      this.issues = issues;
    });
  }

  getIssueByStatus(status: string): void {
    this.is.getIssueByStatus(status).subscribe(issues => {
      this.issues = issues;
    });
  }

  onCardClick(issue: Issues): void {
    this.selectedIssue = issue;
    this.modalData = true;
  }

  updateIssueStatus(id: number | undefined, status: string): void {
    if (id === undefined) {
      console.error('id no definido pero ta raro por que si no como entraste acá');
      return;
    }
    this.is.updateStatusIssue(id, status).subscribe({
      next: (response) => {
        const issue = this.issues.find(issue => issue.idissues === id);
        if (issue) {
          issue.status = status;
        }
        this.modalData = false;
      },
      error: (error) => {
        console.error('a', error);
      },
    });
  }

  updateIssueComplete() {
    if (this.updateIssues.valid && this.selectedIssue?.idissues) {
      const currentTimestamp = this.getMySQLTimestamp();

      const issueAttributes: IssueUpdate = {
        idissues: this.selectedIssue.idissues,
        status: 'CLOSED',
        resolvedBy: this.userName ?? '',
        resolvedDate: currentTimestamp,
        comments: this.updateIssues.value.comments,
      };

      this.is.updateIssueResolution(issueAttributes).subscribe({
        next: (response) => {
          const index = this.issues.findIndex(i => i.idissues === this.selectedIssue?.idissues);
          if (index !== -1) {
            this.issues[index] = {
              ...this.issues[index],
              ...issueAttributes
            };
          }

          this.msgs.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Issue actualizado correctamente'
          });

          this.updateIssues.reset();
          this.modalData = false;
          this.loadIssuesByRoleAndType();
        },
        error: (errorMessage) => {
          this.msgs.add({
            severity: 'error',
            summary: 'Error',
            detail: typeof errorMessage === 'string' ? errorMessage : 'Error al actualizar el issue'
          });
          this.modalData = false;
        },
      });
    } else {
      this.msgs.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete todos los campos requeridos'
      });
    }
  }

  /**
   * Obtiene el timestamp actual en formato MySQL
   * @returns string en formato 'YYYY-MM-DD HH:mm:ss'
   * Ejemplo: '2024-11-06 10:15:00'
   */
  getMySQLTimestamp(): string {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

}
