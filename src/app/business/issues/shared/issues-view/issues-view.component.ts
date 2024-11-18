// Bodriular
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

// Interfaces, Services, Pipes and Directives
import { Issues } from '../../../../core/interfaces/issues';
import { IssuesService } from '../../services/issues.service';
import { Auth } from '../../../../core/services/auth.service';
import { TruncatePipe } from '../../../../core/pipes/truncate.pipe';
import { MediaService } from '../../../../core/services/media.service';

// PrimeNG
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-issues-view',
  standalone: true,
  imports: [CommonModule, DialogModule, TruncatePipe, ImageModule],
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

  constructor(
    private is: IssuesService,
    private activeRoute: ActivatedRoute,
    private authService: Auth,
    private ms: MediaService
  ) { }

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
}
