import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../core/services/shared.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  currentTitle: string = '';  // Variable para almacenar el título actual

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    // Suscribirse a los cambios en el título
    this.sharedService.currentTitle.subscribe(title => {
      this.currentTitle = title;
    });
  }
}
