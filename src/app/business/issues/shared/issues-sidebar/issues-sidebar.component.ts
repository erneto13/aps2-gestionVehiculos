import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

// PrimeNG
import { BadgeModule } from 'primeng/badge';
import { IssuesService } from '../../services/issues.service';

@Component({
  selector: 'app-issues-sidebar',
  standalone: true,
  imports: [BadgeModule, RouterLink, RouterLinkActive],
  templateUrl: './issues-sidebar.component.html',
  styleUrl: './issues-sidebar.component.css'
})
export class IssuesSidebarComponent {

  constructor(private router: Router) { }

  @Output() selectedIssueType = new EventEmitter<string>();

  onIssueTypeSelect(issueType: string) {
    this.router.navigate([`/asuntos/${issueType}`]);
    this.selectedIssueType.emit(issueType);
  }

  onIssueStatusSelect(issueStatus: string) {
    this.router.navigate([`/asuntos/${issueStatus}`]);
    this.selectedIssueType.emit(issueStatus);
  }
}
