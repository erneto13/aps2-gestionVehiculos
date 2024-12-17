import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChartData, ChartOptions } from '../../../../core/interfaces/dashboard';

@Component({
  selector: 'app-expense-chart',
  standalone: true,
  imports: [CommonModule, ChartModule, CurrencyPipe],
  templateUrl: './expense-chart.component.html',
})
export class ExpenseChartComponent {
  @Input() totalExpense!: number;
  @Input() title: string = 'Total de dinero gastado en combustible.';
  @Input() percentageChange: number = 0;
  @Input() chartData!: ChartData;
  @Input() chartOptions!: ChartOptions;

  @Output() chartSwitch = new EventEmitter<void>();

  onSwitchChart() {
    this.chartSwitch.emit();
  }
}
