export interface FuelChartDataset {
    label: string;
    fill: boolean;
    borderColor: string;
    yAxisID: string;
    tension: number;
    data: number[];
}

export interface MonthCostMap {
    [key: string]: number;
}

export interface ChartData {
    labels: string[];
    datasets: FuelChartDataset[];
}

export interface ChartOptions {
    stacked: boolean;
    maintainAspectRatio: boolean;
    aspectRatio: number;
    plugins: {
        legend: {
            labels: {
                color: string;
            }
        }
    };
    scales: {
        x: {
            ticks: {
                color: string;
            };
            grid: {
                color: string;
            }
        };
        y: {
            type: string;
            display: boolean;
            position: string;
            ticks: {
                color: string;
            };
            grid: {
                color: string;
            }
        }
    }
}