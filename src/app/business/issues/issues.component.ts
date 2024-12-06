// Bodriular
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

// Core
import { IssuesSidebarComponent } from "./shared/issues-sidebar/issues-sidebar.component";
import { IssuesHeaderComponent } from "./shared/issues-header/issues-header.component";
import { LoadingService } from '../../core/services/loading.service';
import { SpinnerComponent } from '../../shared/utils/spinner/spinner.component';

@Component({
  selector: 'app-issues',
  standalone: true,
  imports: [CommonModule, FormsModule, IssuesSidebarComponent,
    IssuesHeaderComponent, RouterOutlet, SpinnerComponent],
  templateUrl: './issues.component.html',
})
export default class IssuesComponent {

  selectedIssueType: string = '';

  onIssueTypeSelected(issueType: string) {
    this.selectedIssueType = issueType;
  }

  constructor(public loadingService: LoadingService) { }
}