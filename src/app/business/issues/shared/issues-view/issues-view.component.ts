import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Issues } from '../../../../core/interfaces/issues';
import { IssuesService } from '../../services/issues.service';
import { ActivatedRoute } from '@angular/router';

import { DialogModule } from 'primeng/dialog';


@Component({
  selector: 'app-issues-view',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './issues-view.component.html',
  styleUrl: './issues-view.component.css'
})
export default class IssuesViewComponent implements OnInit {

  issues: Issues[] = [];
  issueType: string = '';

  selectedIssue: Issues | null = null;
  modalData: boolean = false;

  constructor(private is: IssuesService, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      this.issueType = params['issue_type'];
      if (this.issueType === 'closed') {
        this.getIssueByStatus('closed');
      } else {
        this.getIssuesByType(this.issueType);
      }
    });
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
