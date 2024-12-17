import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';

@Injectable({
    providedIn: 'root'
})
export class PdfService {

    constructor() { }

    async generateVehicleTechnicalSheet(vehicleData: any): Promise<void> {
        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.setTextColor(0, 0, 255);
        doc.text('Ficha Técnica del Vehículo', 105, 20);

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Marca: ${vehicleData.brand}`, 20, 40);
        doc.text(`Modelo: ${vehicleData.model}`, 20, 50);
        doc.text(`Año: ${vehicleData.year}`, 20, 60);
        doc.text(`Placa: ${vehicleData.licensePlate}`, 20, 70);
        doc.text(`Color: ${vehicleData.color}`, 20, 80);

        doc.setFontSize(16);
        doc.setTextColor(0, 100, 0);
        doc.text('Especificaciones Técnicas', 20, 100);

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Motor: ${vehicleData.engine}`, 20, 110);
        doc.text(`Transmisión: ${vehicleData.transmission}`, 20, 120);
        doc.text(`Combustible: ${vehicleData.fuelType}`, 20, 130);
        doc.text(`Potencia: ${vehicleData.horsepower} HP`, 20, 140);
        doc.text(`Cilindrada: ${vehicleData.displacement} cc`, 20, 150);

        if (vehicleData.imageUrl) {
            doc.addImage(vehicleData.imageUrl, 'JPEG', 105, 50, 80, 60);
        }

        doc.setFontSize(10);
        doc.text('Este documento es una ficha técnica generada automáticamente.', 105, 280);
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 105, 285);

        doc.save('ficha-tecnica-vehiculo.pdf');
    }
}
