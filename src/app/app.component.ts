import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  userList: any[] = [];
  constructor(private http: HttpClient) {
  }

  getAllUsers() {
    this.http.get("https://jsonplaceholder.typicode.com/users").subscribe((resultado:any) => {
      this.userList = resultado;
    });
  }
}
