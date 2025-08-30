import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "sk-default-key"
});

export interface LeadClassification {
  nivelInteres: "alto" | "medio" | "bajo";
  razonamiento: string;
  recomendaciones: string[];
}

export interface QuoteAnalysis {
  esRazonable: boolean;
  sugerencias: string[];
  riesgos: string[];
}

export async function classifyLead(leadData: {
  nombre: string;
  contacto: string;
  material: string;
  comentarios?: string;
  cotizacionTotal: number;
  urgencia: boolean;
  instalacion: boolean;
}): Promise<LeadClassification> {
  try {
    const prompt = `
Analiza este lead de INKO Impresores y clasifica su nivel de interés. Responde en JSON con el formato exacto:
{
  "nivelInteres": "alto|medio|bajo",
  "razonamiento": "explicación detallada",
  "recomendaciones": ["recomendación1", "recomendación2"]
}

Datos del lead:
- Nombre: ${leadData.nombre}
- Contacto: ${leadData.contacto}
- Material: ${leadData.material}
- Cotización total: $${leadData.cotizacionTotal}
- Urgencia 24h: ${leadData.urgencia ? 'Sí' : 'No'}
- Instalación: ${leadData.instalacion ? 'Sí' : 'No'}
- Comentarios: ${leadData.comentarios || 'Ninguno'}

Criterios para clasificación:
- ALTO: Cotización >$2000, urgencia, instalación, comentarios específicos, email corporativo
- MEDIO: Cotización $800-2000, algunos servicios adicionales, información completa
- BAJO: Cotización mínima, sin servicios adicionales, información básica

Proporciona recomendaciones específicas para el seguimiento de ventas.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "Eres un experto en clasificación de leads para empresa de impresión en gran formato. Responde únicamente en JSON válido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      nivelInteres: result.nivelInteres || 'medio',
      razonamiento: result.razonamiento || 'Clasificación automática',
      recomendaciones: result.recomendaciones || []
    };
  } catch (error) {
    console.error('Error en clasificación IA:', error);
    return {
      nivelInteres: 'medio',
      razonamiento: 'Error en clasificación automática',
      recomendaciones: ['Revisar manualmente']
    };
  }
}

export async function processWhatsAppMessage(message: string): Promise<string> {
  try {
    const prompt = `
Eres el asistente virtual de INKO Impresores, especialistas en impresión en gran formato.

Información de la empresa:
- Materiales: Lona ($120/m²), Vinil ($180/m²), Microperforado ($220/m²), PVC ($280/m²), Acrílico ($350/m²)
- Servicios: Instalación profesional (+$500), Urgencia 24h (+30%)
- Pedido mínimo: $800
- Contacto: flavio@inkoimpresores.com

Responde de manera amigable y profesional. Si preguntan por cotizaciones, solicita:
1. Tipo de material
2. Medidas (ancho x alto)
3. Cantidad de piezas
4. Si requiere instalación
5. Si es urgente

Mensaje del cliente: "${message}"

Responde en español, máximo 200 caracteres, siendo útil y dirigiendo hacia el formulario web si es necesario.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "Eres un asistente de ventas profesional y amigable para INKO Impresores."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return response.choices[0].message.content || 'Lo siento, no pude procesar tu mensaje. ¿Podrías repetirlo?';
  } catch (error) {
    console.error('Error en WhatsApp IA:', error);
    return 'Hola! Soy el asistente de INKO. ¿En qué puedo ayudarte con tu proyecto de impresión?';
  }
}
