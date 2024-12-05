// Bodriular
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

// Interfaces, Services, Pipes and Directives
import { Issues } from '../../../../core/interfaces/issues';
import { IssuesService } from '../../services/issues.service';
import { Auth } from '../../../../core/services/auth.service';
import { IssuesDetailModalComponent } from '../issues-detail-modal/issues-detail-modal.component';
import { IssuesCardComponent } from '../issues-card/issues-card.component';

// PrimeNG
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-issues-view',
  standalone: true,
  imports: [CommonModule, IssuesCardComponent,
    IssuesDetailModalComponent],
  providers: [MessageService],
  templateUrl: './issues-view.component.html',
})
export default class IssuesViewComponent implements OnInit {
  issues: Issues[] = [];
  issueType: string = '';
  selectedIssue: Issues | null = null;
  modalData: boolean = false;
  userRole: string | null = null;
  driverName: string | null = null;
  subscription: Subscription = new Subscription();

  constructor(
    private is: IssuesService,
    private activeRoute: ActivatedRoute,
    private authService: Auth
  ) { }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.driverName = this.authService.getDriverName();

    this.activeRoute.params.subscribe(params => {
      let rawIssueType = params['issue_type'];
      this.issueType = this.formatIssueType(rawIssueType);
      console.log('issueType', this.issueType);
      this.loadIssuesByRoleAndType();
    });

    // este solo se ejecuta cuando 
    // se crea un nuevo issue
    this.subscription.add(
      this.is.issueCreated$.subscribe(() => {
        this.loadIssuesByRoleAndType();
      })
    );
  }

  loadIssuesByRoleAndType(): void {
    if (this.userRole === 'admin') {
      // admin
      this.issueType === 'Closed'
        ? this.getIssueByStatus('closed')
        : this.getIssuesByType(this.issueType);
    } else if (this.driverName) {
      // driver
      if (this.issueType === 'Closed') {
        this.is.getClosedIssuesByUser(this.driverName).subscribe(issues => {
          this.issues = issues;
        });
      } else {
        this.is.getIssueByTypePerUser(this.issueType, this.driverName).subscribe(issues => {
          this.issues = issues;
        });
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

  formatIssueType(issueType: string): string {
    if (!issueType) return '';
    return issueType
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}