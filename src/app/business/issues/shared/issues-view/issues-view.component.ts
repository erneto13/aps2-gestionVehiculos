// Bodriular
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Interfaces, Services, Pipes and Directives
import { Issues, IssueUpdate } from '../../../../core/interfaces/issues';
import { IssuesService } from '../../services/issues.service';
import { Auth } from '../../../../core/services/auth.service';
import { TruncatePipe } from '../../../../core/pipes/truncate.pipe';
import { SharedService } from '../../../../core/services/shared.service';

// PrimeNG
import { GalleriaModule } from 'primeng/galleria';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'app-issues-view',
  standalone: true,
  imports: [CommonModule, DialogModule, TruncatePipe, GalleriaModule,
    InputTextareaModule, ReactiveFormsModule, MessagesModule
  ],
  providers: [MessageService],
  templateUrl: './issues-view.component.html',
})
export default class IssuesViewComponent implements OnInit {

  issues: Issues[] = [];
  issueType: string = '';
  selectedIssue: Issues | null = null;
  modalData: boolean = false;

  userRole: string | null = null;
  userName: string | null = null;
  responsiveOptions: any[] | undefined;

  updateIssues!: FormGroup;

  constructor(
    private is: IssuesService,
    private activeRoute: ActivatedRoute,
    private authService: Auth,
    private fb: FormBuilder,
    private msgs: MessageService,
    private shared: SharedService
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
    console.log(issue.evidence);
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
      const currentTimestamp = this.shared.getMySQLTimestamp();

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

  loadResponsiveOptions(): void {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }
}
