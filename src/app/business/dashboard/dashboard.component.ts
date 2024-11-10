import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KnobModule } from 'primeng/knob';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, KnobModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export default class DashboardComponent {
  value!: number;

}
