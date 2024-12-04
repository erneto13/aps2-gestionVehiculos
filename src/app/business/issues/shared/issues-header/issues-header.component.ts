// Bodriular
import { Component, Input, OnInit } from '@angular/core';

// Core & Shared
import { IssuesFormComponent } from '../issues-form/issues-form.component';

// PrimeNG
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-issues-header',
  standalone: true,
  imports: [DialogModule, IssuesFormComponent],
  templateUrl: './issues-header.component.html',
})
export class IssuesHeaderComponent implements OnInit {
  @Input() issueType: string = '';
  visible: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onChange() {
    this.visible = true;
  }
}
