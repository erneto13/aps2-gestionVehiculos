import { Injectable } from '@angular/core';
import { FuelRecordResponse } from '../interfaces/fuel_records';
import { ChartOptions, MonthCostMap } from '../interfaces/dashboard';

@Injectable({
  providedIn: 'root'
})
export class FuelAnalyticsService {

  constructor() { }

  calculateMonthCosts(records: FuelRecordResponse[]): MonthCostMap {
    return records.reduce((acc, record) => {
      const month = this.formatMonth(record.fuelDate);
      acc[month] = (acc[month] || 0) + Number(record.cost);
      return acc;
    }, {} as MonthCostMap);
  }

  calculateFuelPercentageChange(fuelRecords: FuelRecordResponse[]): number {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const currentMonthCosts = this.filterRecordsByMonthAndYear(
      fuelRecords,
      currentMonth,
      currentYear
    );

    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const previousMonthCosts = this.filterRecordsByMonthAndYear(
      fuelRecords,
      previousMonth,
      previousYear
    );

    const currentMonthTotalCost = this.sumRecordsCost(currentMonthCosts);
    const previousMonthTotalCost = this.sumRecordsCost(previousMonthCosts);

    return this.calculatePercentageChange(
      previousMonthTotalCost,
      currentMonthTotalCost
    );
  }

  getChartOptions(documentStyle: CSSStyleDeclaration): ChartOptions {
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    return {
      stacked: false,
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    };
  }

  private filterRecordsByMonthAndYear(
    records: FuelRecordResponse[],
    month: number,
    year: number
  ): FuelRecordResponse[] {
    return records.filter(record => {
      const recordDate = new Date(record.fuelDate);
      return recordDate.getFullYear() === year &&
        recordDate.getMonth() === month;
    });
  }

  private sumRecordsCost(records: FuelRecordResponse[]): number {
    return records.reduce((total, record) => total + Number(record.cost), 0);
  }

  private calculatePercentageChange(
    previousValue: number,
    currentValue: number
  ): number {
    if (previousValue === 0 && currentValue > 0) return 100;
    if (previousValue === 0 && currentValue === 0) return 0;

    return ((currentValue - previousValue) / previousValue) * 100;
  }

  private formatMonth(date: string): string {
    return new Date(date).toLocaleString('default', { month: 'short' });
  }
}
