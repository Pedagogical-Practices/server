import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, GenerationConfig, GenerativeModel } from '@google/generative-ai';
import { jsonrepair } from 'jsonrepair';

// Define el tipo para la estructura de un campo de formulario
interface FormField {
  name: string;
  label: string;
  value?: any;
  // Añade aquí otras propiedades que puedan ser relevantes para la plantilla
}

// Define el tipo para la estructura de la definición de un formulario
interface FormDefinition {
  name: string;
  fields: FormField[];
}

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI;
  private generationConfig: GenerationConfig;
  private safetySettings: any;
  private model: GenerativeModel;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY no está configurada en las variables de entorno.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);

    this.generationConfig = {
      temperature: 0.2,
      topP: 1,
      topK: 32,
      maxOutputTokens: 4096,
      responseMimeType: 'application/json',
    };

    this.model = this.genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: this.generationConfig
    });

    this.safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ];
  }

  private streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  async extractDataFromDocument(formDefinition: FormDefinition, file: { createReadStream: () => NodeJS.ReadableStream; mimetype: string }): Promise<any> {
    this.logger.log(`Iniciando extracción de datos para el formulario: ${formDefinition.name}`);

    const { createReadStream, mimetype } = file;
    const stream = createReadStream();
    const buffer = await this.streamToBuffer(stream);
    const base64Data = buffer.toString('base64');

    const imagePart = {
      inlineData: {
        mimeType: mimetype,
        data: base64Data,
      },
    };

    const prompt = `
      Analiza la imagen de un documento que ha sido llenado.
      Tu tarea es extraer la información del documento para rellenar un objeto JSON que representa los datos de un formulario.
      Debes usar la siguiente estructura JSON como plantilla. Para cada objeto en el array 'fields', lee la 'label' y busca la respuesta o dato correspondiente en el documento. Luego, escribe esa respuesta en la propiedad 'value' de ese objeto.

      **Plantilla JSON para 'formData':**
      ${JSON.stringify(formDefinition, null, 2)}

      **Instrucciones detalladas:**
      1. El JSON final debe ser únicamente el objeto \'formData\' que contiene los campos llenados.
      2. Para cada campo en la plantilla, busca la información en el documento que corresponde a su \`label\` y rellena su \`value\`.
      3. Si no encuentras información para un campo específico, deja su \`value\` como una cadena vacía \"\".
      4. No modifiques las claves \`name\` o \`label\` de la plantilla.
      5. Asegúrate de que la salida sea un único objeto JSON válido, sin texto adicional, comentarios o marcadores de formato.
    `

    try {
      const result = await this.model.generateContent([prompt, imagePart]);
      const response = result.response;
      const text = response.text();
      
      this.logger.log('Respuesta de la API de Gemini recibida.');
      
      // Intenta reparar el JSON si es necesario antes de parsearlo
      const repairedJson = jsonrepair(text);
      return JSON.parse(repairedJson);

    } catch (error) {
      this.logger.error('Error al llamar a la API de Gemini', error.stack);
      throw new Error('No se pudo extraer los datos del documento.');
    }
  }
}
