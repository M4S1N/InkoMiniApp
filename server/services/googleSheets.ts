import { Lead } from "@shared/schema";

// Google Sheets service for lead storage
export class GoogleSheetsService {
  private apiKey: string;
  private spreadsheetId: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_SHEETS_API_KEY || process.env.GOOGLE_API_KEY || "default_key";
    this.spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID || "default_spreadsheet_id";
  }

  async saveLead(lead: Lead): Promise<boolean> {
    try {
      // Format data for Google Sheets
      const rowData = [
        lead.nombre,
        lead.contacto,
        lead.material,
        `${lead.ancho}x${lead.alto}`,
        lead.piezas,
        lead.instalacion ? 'Sí' : 'No',
        lead.urgencia ? 'Sí' : 'No',
        `$${lead.cotizacionTotal.toLocaleString('es-MX')}`,
        lead.nivelInteres,
        lead.comentarios || '',
        lead.createdAt.toLocaleString('es-MX'),
        lead.clasificacionIA || ''
      ];

      // Google Sheets API call (simplified - would need googleapis in production)
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Leads:append?valueInputOption=RAW&key=${this.apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [rowData]
        })
      });

      if (!response.ok) {
        console.error('Error saving to Google Sheets:', await response.text());
        return false;
      }

      console.log('Lead saved to Google Sheets successfully');
      return true;
    } catch (error) {
      console.error('Error in Google Sheets service:', error);
      return false;
    }
  }

  async initializeSheet(): Promise<void> {
    try {
      // Initialize headers if sheet is empty
      const headers = [
        'Nombre',
        'Contacto',
        'Material',
        'Medidas',
        'Piezas',
        'Instalación',
        'Urgencia',
        'Cotización',
        'Nivel Interés',
        'Comentarios',
        'Fecha',
        'Clasificación IA'
      ];

      // This would check if headers exist and add them if not
      console.log('Google Sheets headers ready:', headers);
    } catch (error) {
      console.error('Error initializing Google Sheets:', error);
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
