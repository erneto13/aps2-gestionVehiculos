import { TitleCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { IssuesFormComponent } from '../issues-form/issues-form.component';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IssuesService } from '../../services/issues.service';

@Component({
  selector: 'app-issues-header',
  standalone: true,
  imports: [DialogModule, IssuesFormComponent, TitleCasePipe],
  templateUrl: './issues-header.component.html',
})
export class IssuesHeaderComponent implements OnInit {
  issueType: string = '';
  visible: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(private is: IssuesService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Escuchar cambios en los parámetros de la ruta
    this.subscription.add(
      this.route.params.subscribe(params => {
        const rawIssueType = params['issue_type'];
        this.issueType = this.formatIssueType(rawIssueType);
      })
    );

    // Escuchar eventos de creación de issues
    this.subscription.add(
      this.is.issueCreated$.subscribe(() => {
        this.visible = false;
      })
    );
  }

  onChange() {
    this.visible = true;
  }

  // Método para formatear el issue type
  formatIssueType(issueType: string): string {
    if (!issueType) return '';
    return issueType
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
