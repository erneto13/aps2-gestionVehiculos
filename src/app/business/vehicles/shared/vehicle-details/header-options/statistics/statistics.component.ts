import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FuelRecordResponse } from '../../../../../../core/interfaces/fuel_records';
import { VehicleApiService } from '../../../../services/vehicle-api.service';
import { Vehicle } from '../../../../../../core/interfaces/vehicle';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './statistics.component.html',
})
export default class StatisticsComponent implements OnInit {
  fuelChartData: any;
  fuelChartOptions: any;

  data: any;
  options: any;

  fuelRecords: FuelRecordResponse[] = [];
  vehicle!: Vehicle;

  constructor(private vehicleService: VehicleApiService) { }

  ngOnInit() {
    this.vehicleService.selectedVehicle$.subscribe((vehicle) => {
      this.vehicle = vehicle;
      this.loadFuelRecords();
    });
  }

  loadFuelRecords() {
    const vehicleId = this.vehicle.vehicle_id;
    this.vehicleService.getRecordsByVehicleId(vehicleId).subscribe((records) => {
      this.fuelRecords = records;
      this.generateFuelChartData();
      this.generatePieChartData();
    });
  }

  generateFuelChartData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    if (!this.fuelRecords) {
      this.fuelRecords = [];
    }

    const fuelData = this.fuelRecords.length > 0
      ? this.fuelRecords.map((record) => record.liters)
      : [0, 0, 0, 0, 0, 0, 0];

    const kiloData = this.fuelRecords.length > 0
      ? this.fuelRecords.map((record) => record.odometer)
      : [0, 0, 0, 0, 0, 0, 0];

    const costData = this.fuelRecords.length > 0
      ? this.fuelRecords.map((record) => record.cost)
      : [0, 0, 0, 0, 0, 0, 0];

    this.fuelChartData = {
      labels: ['Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr'],
      datasets: [
        {
          label: 'Litros cargados',
          data: fuelData,
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4
        },
        {
          label: 'Kilometros recorridos',
          data: kiloData,
          fill: false,
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          tension: 0.4
        },
        {
          label: 'Costos',
          data: costData,
          fill: false,
          borderColor: documentStyle.getPropertyValue('--red-500'),
          tension: 0.4
        }
      ]
    };

    this.fuelChartOptions = {
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
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  generatePieChartData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const backgroundColors = [
      documentStyle.getPropertyValue('--blue-500'),
      documentStyle.getPropertyValue('--yellow-500'),
      documentStyle.getPropertyValue('--green-500'),
      documentStyle.getPropertyValue('--orange-500'),
      documentStyle.getPropertyValue('--pink-500'),
      documentStyle.getPropertyValue('--purple-500')
    ];

    // si hay datos vacios lo muestra pero vacio
    if (this.fuelRecords.length === 0) {
      this.data = {
        labels: ['Sin datos'],
        datasets: [
          {
            data: [0],
            backgroundColor: [documentStyle.getPropertyValue('--gray-500')],
            hoverBackgroundColor: [documentStyle.getPropertyValue('--gray-400')]
          }
        ]
      };
      return;
    }

    const litersByStation: { [key: string]: number } = {};
    this.fuelRecords.forEach((record) => {
      const station = record.station || 'guachicolero';
      litersByStation[station] = (litersByStation[station] || 0) + record.liters;
    });

    const labels = Object.keys(litersByStation);
    const data = Object.values(litersByStation);

    this.data = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColors.slice(0, labels.length),
          hoverBackgroundColor: backgroundColors.map((color) => color.replace('500', '400'))
        }
      ]
    };

    this.options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };
  }
}