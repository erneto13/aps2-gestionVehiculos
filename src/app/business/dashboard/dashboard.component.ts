import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KnobModule } from 'primeng/knob';
import { Auth } from '../../core/services/auth.service';
import { User } from '../../core/interfaces/user';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, KnobModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export default class DashboardComponent {

  constructor(private auth: Auth) { }

  ngOnInit(): void {
  }
}
