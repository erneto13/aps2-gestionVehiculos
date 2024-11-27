import { Component } from '@angular/core';
import { FooterLandingPage } from '../footer/footer.component';
import { GeminiGenerateComponent } from '../gemini-generate/gemini-generate.component';
import { HeaderLanginPage } from '../header/header.component';
import { InfoLandingPage } from '../info/info.component';
import { PricingLandingPage } from '../pricing/pricing.component';

@Component({
  selector: 'landing-page-layout',
  standalone: true,
  imports: [FooterLandingPage, GeminiGenerateComponent, HeaderLanginPage, InfoLandingPage, PricingLandingPage],
  templateUrl: './layout.component.html',
  styles: ''
})
export default class LayoutLandingPage {

}
