import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth } from './core/services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: Auth, @Inject(PLATFORM_ID) private platformId: Object) { }

  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      // Importa flowbite solo en el cliente
      const { initFlowbite } = await import('flowbite');
      initFlowbite();  // Solo se ejecutará en el navegador
    }
    if (this.authService.isAuthenticated()) {
      this.authService.autoRefreshToken();
      this.authService.getDetailUser().subscribe();
    }
  }
}
