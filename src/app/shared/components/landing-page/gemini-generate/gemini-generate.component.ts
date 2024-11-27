import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  vehicleOptions: string[] = ['1-4', '5-29', '30-399', '400+'];
  features: string[] = ['GPS', 'Mantenimiento', 'Reservas', 'Gestiones'];
  contactFields: string[] = ['email', 'name', 'phone', 'company'];

  isResultScreen: boolean = false;
  iaPense: boolean = false;
  response: string = ''
  pricingContent: string = '';

  constructor(private fb: FormBuilder, private geminiService: GeminiService, private sharedService: SharedService) {
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

    const prompt: string = `Hola Gemini, soy Jarvis, un asistente en una plataforma de Sistema de Gestión de Flotillas. 
    Con base en las necesidades del cliente, queremos ofrecerle el mejor paquete. Devuelve la respuesta en el siguiente formato JSON:
    
    {
      "recommendedPackage": "string",
      "reasoning": "string",
      "additionalInfo": "string"
    }
    
    Por favor no envies el JSON con las 3 ` + '`' + ` y el json al principio y al final.
    Ademas indica la respuesta como si la estuviera explicando al cliente.

    Datos del cliente:
    ${JSON.stringify(this.geminiPrompt.value)}
    
    Contenido de precios:
    ${this.pricingContent}`;

    try {
      const result = await this.geminiService.generatePrompt(prompt);

      this.iaPense = false;

      if (result.error) {
        console.error('Error en la respuesta:', result.rawResponse);
        this.response = 'Hubo un problema al procesar la respuesta. Verifica la consola.';
      } else {
        // Acceder y mostrar las propiedades del JSON
        console.log('Respuesta en JSON:', result);
        this.response = `
          Paquete Recomendado: ${result.recommendedPackage}
          Motivo: ${result.reasoning}
          Información Adicional: ${result.additionalInfo}
        `;
      }
    } catch (error) {
      console.error('Error durante la generación del prompt:', error);
      this.iaPense = false;
      this.response = 'Hubo un error al comunicarse con Gemini.';
    }
  }

  showInvalidFields() {
    for (const controlName in this.geminiPrompt.controls) {
      if (this.geminiPrompt.controls[controlName].invalid) {
        console.log(`El campo ${controlName} es inválido`);
      }
    }
  }
}