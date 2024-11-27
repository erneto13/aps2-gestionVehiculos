import { Component } from '@angular/core';
import { SharedService } from '../../../../core/services/shared.service';

@Component({
  selector: 'pricing-landing',
  standalone: true,
  imports: [],
  templateUrl: './pricing.component.html',
})
export class PricingLandingPage {
  constructor(private sharedService: SharedService) { }

  ngAfterViewInit() {
    const pricingElement = document.getElementById('pricing-container');
    if (pricingElement) {
      this.sharedService.updatePricingContent(pricingElement.innerHTML);
    }
  }

}
