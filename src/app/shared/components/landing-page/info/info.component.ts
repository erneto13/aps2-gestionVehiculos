import { Component } from '@angular/core';
import { GeminiGenerateComponent } from '../gemini-generate/gemini-generate.component';

@Component({
  selector: 'info-landing',
  standalone: true,
  imports: [GeminiGenerateComponent],
  templateUrl: './info.component.html',
})
export class InfoLandingPage {

}
