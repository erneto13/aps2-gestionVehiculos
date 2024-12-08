import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../core/services/auth.service';
import { SharedService } from '../../../core/services/shared.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  constructor(private auth: Auth, private sharedService: SharedService,
    private activatedRoute: ActivatedRoute) { }

  submenuOpen: boolean = false
  role: string | null = null

  driverPhotoUrl!: string;
  driverName!: string;
  asa = ['a', 'b', 'c', 'd', 'e', 'f'];

  ngOnInit(): void {
    this.role = this.auth.getUserRole();

    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    route.data.subscribe(data => {
      const title = data['title'] || 'Panel';
      this.sharedService.changeTitle(title);
    });

    this.getInfoDriver();
  }

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

  getInfoDriver(): void {
    this.driverName = this.auth.getDriverName() ?? '';
    this.driverPhotoUrl = this.auth.getDriverPhoto() ?? '';
  }
}
