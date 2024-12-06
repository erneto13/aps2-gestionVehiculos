import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

// PrimeNG
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-issues-sidebar',
  standalone: true,
  imports: [BadgeModule, RouterLink, RouterLinkActive],
  templateUrl: './issues-sidebar.component.html',
  styleUrl: './issues-sidebar.component.css'
})
export class IssuesSidebarComponent {
  @Output() selectedIssueType = new EventEmitter<string>();

  constructor(private router: Router) { }

  onIssueTypeSelect(issueType: string) {
    this.router.navigate([`/asuntos/${issueType}`]);
    this.selectedIssueType.emit(issueType);
  }

  onIssueStatusSelect(issueStatus: string) {
    this.router.navigate([`/asuntos/${issueStatus}`]);
    this.selectedIssueType.emit(issueStatus);
  }
}
