import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IssuesSidebarComponent } from "./shared/issues-sidebar/issues-sidebar.component";
import { IssuesHeaderComponent } from "./shared/issues-header/issues-header.component";
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-issues',
  standalone: true,
  imports: [CommonModule, FormsModule, IssuesSidebarComponent, 
    IssuesHeaderComponent, RouterOutlet],
  templateUrl: './issues.component.html',
  styleUrl: './issues.component.css'
})
export default class IssuesComponent {
}