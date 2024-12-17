import { Injectable } from '@angular/core';
import { Issues } from '../interfaces/issues';

@Injectable({
    providedIn: 'root'
})
export class IssueAnalyticsService {
    constructor() { }

    /**
     * Calcula el número de reportes por tipo de issue.
     * @param issues Lista de issues obtenidas desde la API.
     * @returns Un mapa con el tipo de issue como clave y el conteo como valor.
     */
    calculateIssueTypeFrequency(issues: Issues[]): Record<string, number> {
        return issues.reduce((acc, issue) => {
            const type = issue.issueType;
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }

    /**
     * Obtiene el tipo de issue más reportado.
     * @param frequencyMap Mapa de frecuencia generado por `calculateIssueTypeFrequency`.
     * @returns Un objeto con el tipo de issue más reportado y su conteo.
     */
    getTrendingIssueType(frequencyMap: Record<string, number>): { type: string; count: number } {
        let trendingType = '';
        let maxCount = 0;

        for (const [type, count] of Object.entries(frequencyMap)) {
            if (count > maxCount) {
                trendingType = type;
                maxCount = count;
            }
        }

        return { type: trendingType, count: maxCount };
    }

    /**
     * Formatea los datos para integrarlos en un gráfico.
     * @param frequencyMap Mapa de frecuencia generado por `calculateIssueTypeFrequency`.
     * @returns Un objeto con etiquetas (`labels`) y datos (`data`) para un gráfico.
     */
    getChartData(frequencyMap: Record<string, number>): { labels: string[]; data: number[] } {
        const labels = Object.keys(frequencyMap);
        const data = Object.values(frequencyMap);

        return { labels, data };
    }
}
