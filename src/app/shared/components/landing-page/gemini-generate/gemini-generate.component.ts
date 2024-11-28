// Bodriular
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// Core
import { GeminiService } from '../../../../core/services/gemini.service';
import { SharedService } from '../../../../core/services/shared.service';

@Component({
  selector: 'app-gemini-generate',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './gemini-generate.component.html'
})
export class GeminiGenerateComponent implements OnInit {
  step = 1;
  geminiPrompt!: FormGroup;
  services: string[] = ['Logística', 'Transporte', 'Almacenamiento', 'Distribución'];
  vehicleOptions: string[] = ['1-4', '5-20', '30-100', '200+'];
  features: string[] = ['GPS', 'Mantenimiento', 'Reservas', 'Gestiones'];

  isResultScreen: boolean = false;
  iaPense: boolean = false;
  response: { recommendedPackage: string; reasoning: string; additionalInfo: string } | null = null;
  pricingContent: string = '';

  constructor(
    private fb: FormBuilder,
    private geminiService:
      GeminiService,
    private sharedService: SharedService) {
    this.geminiPrompt = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      company: ['', [Validators.required]],
      features: ['', [Validators.required]],
      services: [[], [Validators.required]],
      vehicleCount: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.sharedService.pricingContent$.subscribe(content => {
      this.pricingContent = content;
    });
  }

  goNext() {
    if (this.step < 3) this.step++;
  }

  goBack() {
    if (this.step > 1) this.step--;
  }

  async onSubmit() {
    if (this.geminiPrompt.invalid) {
      console.log('Formulario inválido');
      this.showInvalidFields();
      return;
    }

    this.isResultScreen = true;
    this.iaPense = true;

    const prompt = `Hola Gemini, soy Jarvis, un asistente en una plataforma de Sistema de Gestión de Flotillas. 
    Con base en las necesidades del cliente, queremos ofrecerle el mejor paquete. Devuelve la respuesta en el siguiente formato JSON:
    
    {
      "recommendedPackage": "string",
      "reasoning": "string",
      "additionalInfo": "string"
    }
    
    Por favor no envies el JSON con las 3 ` + '`' + ` y el json al principio y al final.
    Solo el JSON y nada más.
  
    Datos del cliente:
    ${JSON.stringify(this.geminiPrompt.value)}
    
    Contenido de precios. Por favor cuando me devuelvas la respuesta 
    El nombre de los paquetes son los siguiente: Básico, Starter, Pro y Enterprise.
    ${this.pricingContent}`;

    try {
      const result = await this.geminiService.generatePrompt(prompt);

      this.iaPense = false;

      let parsedResult;
      if (typeof result === 'string') {
        try {
          parsedResult = JSON.parse(result);
        } catch (error) {
          console.error('Error al parsear el JSON:', error);
          this.response = null;
          return;
        }
      } else {
        parsedResult = result;
      }

      if (
        parsedResult.recommendedPackage &&
        parsedResult.reasoning &&
        parsedResult.additionalInfo
      ) {
        this.response = parsedResult;
      } else {
        console.error('La respuesta no contiene todas las propiedades esperadas:', parsedResult);
        this.response = null;
      }
    } catch (error) {
      console.error('Error durante la generación del prompt:', error);
      this.iaPense = false;
      this.response = null;
    }
  }

  showInvalidFields() {
    for (const controlName in this.geminiPrompt.controls) {
      if (this.geminiPrompt.controls[controlName].invalid) {
        console.log(`El campo ${controlName} es inválido`);
      }
    }
  }

  reEvaluate() {
    this.step = 1;
    this.isResultScreen = false;
    this.response = null;
    this.geminiPrompt.reset();
  }
}