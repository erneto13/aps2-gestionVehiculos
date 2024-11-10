import { TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-issues-header',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './issues-header.component.html',
  styleUrl: './issues-header.component.css'
})
export class IssuesHeaderComponent {
  @Input() issueType: string = '';
}
