import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { HeaderComponent } from "../header/header.component";
import { RouterOutlet } from '@angular/router';
import { Auth } from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, RouterOutlet],
  templateUrl: './layout.component.html',
})
export default class LayoutComponent implements OnInit {
  constructor(private auth: Auth) { }

  role: string | null = null

  ngOnInit(): void {
    this.role = this.auth.getUserRole()
  }

}
