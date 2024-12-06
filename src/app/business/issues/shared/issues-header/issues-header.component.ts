// Bodriular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

// Core
import { IssuesService } from '../../services/issues.service';
import { IssuesFormComponent } from '../issues-form/issues-form.component';

// PrimeNG
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-issues-header',
  standalone: true,
  imports: [DialogModule, IssuesFormComponent],
  templateUrl: './issues-header.component.html',
})
export class IssuesHeaderComponent implements OnInit, OnDestroy {
  issueType: string = '';
  icon: string = '';
  visible: boolean = false;
  subscription: Subscription = new Subscription();

  constructor(
    private is: IssuesService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.updateIssueType();
        })
    );

    this.updateIssueType();

    this.subscription.add(
      this.is.issueCreated$.subscribe(() => {
        this.visible = false;
      })
    );
  }

  issueIcons: Record<string, string> = {
    'Vehículos': 'pi pi-car',
    'Asignación de vehículos': 'pi pi-user-plus',
    'Servicios': 'pi pi-wrench',
    'Auto Partes': 'pi pi-box',
    'Combustible': 'pi pi-bolt',
    'Cerrados': 'pi pi-lock',
  };

  onChange() {
    this.visible = true;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  updateIssueType() {
    const segments = this.router.url.split('/');
    const lastSegment = segments.pop() || '';

    this.issueType = this.formatIssueType(lastSegment);
    this.icon = this.getIconForIssue(this.issueType);
  }

  formatIssueType(segment: string): string {
    const replacements: Record<string, string> = {
      'asignacion de vehiculos': 'Asignación de vehículos',
      'vehiculos': 'Vehículos',
    };
    const normalizedSegment = segment.toLowerCase().replace(/-/g, ' ');
    return replacements[normalizedSegment] || normalizedSegment
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  getIconForIssue(issueType: string): string {
    return this.issueIcons[issueType] || 'pi pi-question'; 
  }
}
