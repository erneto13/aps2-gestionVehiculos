import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ButtonComponent } from "../../../../shared/utils/button/button.component";
import { IssueType, NewIssues } from '../../../../core/interfaces/issues';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-issues-header',
  standalone: true,
  imports: [TitleCasePipe, ButtonComponent, DialogModule, InputTextareaModule,
    DropdownModule, CommonModule, ReactiveFormsModule
  ],
  templateUrl: './issues-header.component.html',
  styleUrl: './issues-header.component.css'
})
export class IssuesHeaderComponent implements OnInit {
  @Input() issueType: string = '';
  visible: boolean = false;

  newIssueForm: FormGroup
  userName: string | null = null;
  listOfTimes: Date[] = [];

  constructor(private fb: FormBuilder,
    private auth: Auth,
  ) {
    this.newIssueForm = this.fb.group({
      title: ['', [Validators.required, Validators.nullValidator]],
      description: ['', [Validators.required, Validators.nullValidator]],
      selectedIssueType: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      if (user) {
        this.userName = user?.name;
      }
    })
  }

  pushIssue() {
    if (this.newIssueForm.valid) {
      const issueAttributes: NewIssues = {
        title: this.newIssueForm.value.title,
        description: this.newIssueForm.value.description,
        issue_type: this.newIssueForm.value.selectedIssueType,
        status: 'PENDING',
        evidence: [],
        reportedBy: this.userName ?? 'Unknown',
        reportedDate: this.getTime(),
      };
      console.log(issueAttributes);
    }
  }
  getTime(): string {
    return '2021-09-01T00:00:00.000Z';
  }

  openCreateIssueModal() {
    this.visible = true;
  }

  issueTypes = Object.keys(IssueType).filter((key) => isNaN(Number(key)))
    .map((key) => ({ label: this.titleCase(key), value: key }));

  titleCase(str: string): string {
    return str.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
