export interface OverviewCard {
    value: number;
    label: string,
    percentage: number,
    trend: 'up' | 'down';
}