import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../core/services/auth.service';
import { SharedService } from '../../../core/services/shared.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  submenuOpen: boolean = false

  constructor(private auth: Auth, private sharedService: SharedService) { }

  // cerrar sesión
  logout(): void {
    this.auth.logout();
  }

  toggleSubmenu() {
    this.submenuOpen = !this.submenuOpen;
  }

  selectTitle(title: string) {
    this.sharedService.changeTitle(title);
  }

}
