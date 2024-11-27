import { Injectable, OnInit } from '@angular/core';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  public result: string = '';
  private generativeAI: GoogleGenerativeAI;

  constructor() {
    this.generativeAI = new GoogleGenerativeAI(environment.gemini);
  }

  async generatePrompt(prompt: string): Promise<any> {
    const model = this.generativeAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);

    const res = await result.response;
    const text = await res.text();
    console.log('Texto recibido:', text);

    try {
      const jsonResponse = JSON.parse(text);
      return jsonResponse;
    } catch (error) {
      console.error('Error al parsear el JSON:', error);
      // Si no es JSON válido, devuelve el texto como está
      return { error: 'Invalid JSON format', rawResponse: text };
    }
  }

}
