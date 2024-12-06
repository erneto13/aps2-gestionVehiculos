import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth } from './core/services/auth.service';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: Auth, public loadingService: LoadingService) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.authService.autoRefreshToken();
    }
  }
}
