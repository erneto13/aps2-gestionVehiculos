import { Component, EventEmitter, HostListener, Output } from '@angular/core';
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

  constructor(private router: Router) { }

  @Output() selectedIssueType = new EventEmitter<string>();

  /*
  Método para navegar a las diferentes rutas
  de la opcion seleccionada del Sidebar-Issues.
  @param issueType: string - Tipo de asunto.
  */
  onIssueTypeSelect(issueType: string) {
    this.router.navigate([`/asuntos/${issueType}`]);
    this.selectedIssueType.emit(issueType);
  }

  /*
  Método para navegar a la ruta de los asuntos
  con un status de cerrado o el seleccionado.
  @param issueStatus: string - Status del asunto.
  */
  onIssueStatusSelect(issueStatus: string) {
    this.router.navigate([`/asuntos/${issueStatus}`]);
    this.selectedIssueType.emit(issueStatus);
  }
}
