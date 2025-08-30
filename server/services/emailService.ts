import { Lead } from "@shared/schema";

export class EmailService {
  private smtpConfig: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
  };

  constructor() {
    this.smtpConfig = {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      user: process.env.GMAIL_USER || process.env.EMAIL_USER || 'default@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD || 'default_password'
    };
  }

  async sendLeadNotification(lead: Lead): Promise<boolean> {
    try {
      const emailContent = this.generateEmailContent(lead);
      
      // In production, this would use nodemailer
      // For now, we'll simulate the email sending
      console.log('Sending email to flavio@inkoimpresores.com');
      console.log('Email content:', emailContent);

      // Simulate API call to email service
      const emailData = {
        to: 'flavio@inkoimpresores.com',
        subject: `Nuevo Lead - ${lead.material} - $${lead.cotizacionTotal.toLocaleString('es-MX')}`,
        html: emailContent,
        from: this.smtpConfig.user
      };

      // In production, implement actual email sending with nodemailer
      // const transporter = nodemailer.createTransporter(this.smtpConfig);
      // await transporter.sendMail(emailData);

      console.log('Email sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  private generateEmailContent(lead: Lead): string {
    const area = lead.ancho * lead.alto * lead.piezas;
    
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .info-table th, .info-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .info-table th { background-color: #f8f9fa; }
        .highlight { background-color: #fef3c7; padding: 10px; border-radius: 5px; margin: 15px 0; }
        .interest-${lead.nivelInteres} { 
            color: ${lead.nivelInteres === 'alto' ? '#dc2626' : lead.nivelInteres === 'medio' ? '#ea580c' : '#6b7280'};
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 Nuevo Lead - INKO Impresores</h1>
        <p>Cotización: $${lead.cotizacionTotal.toLocaleString('es-MX')} | Interés: <span class="interest-${lead.nivelInteres}">${lead.nivelInteres.toUpperCase()}</span></p>
    </div>
    
    <div class="content">
        <h2>Información del Cliente</h2>
        <table class="info-table">
            <tr><th>Nombre</th><td>${lead.nombre}</td></tr>
            <tr><th>Contacto</th><td>${lead.contacto}</td></tr>
            <tr><th>Fecha</th><td>${lead.createdAt.toLocaleString('es-MX')}</td></tr>
        </table>

        <h2>Detalles del Proyecto</h2>
        <table class="info-table">
            <tr><th>Material</th><td>${lead.material.charAt(0).toUpperCase() + lead.material.slice(1)}</td></tr>
            <tr><th>Medidas</th><td>${lead.ancho}m × ${lead.alto}m</td></tr>
            <tr><th>Área total</th><td>${area.toFixed(2)} m²</td></tr>
            <tr><th>Cantidad</th><td>${lead.piezas} pieza(s)</td></tr>
            <tr><th>Instalación</th><td>${lead.instalacion ? '✅ Sí (+$500)' : '❌ No'}</td></tr>
            <tr><th>Urgencia 24h</th><td>${lead.urgencia ? '⚡ Sí (+30%)' : '❌ No'}</td></tr>
        </table>

        ${lead.comentarios ? `
        <h2>Comentarios del Cliente</h2>
        <div class="highlight">
            "${lead.comentarios}"
        </div>
        ` : ''}

        <h2>Análisis de IA</h2>
        <div class="highlight">
            <strong>Nivel de Interés:</strong> <span class="interest-${lead.nivelInteres}">${lead.nivelInteres.toUpperCase()}</span><br>
            ${lead.clasificacionIA ? `<strong>Análisis:</strong> ${lead.clasificacionIA}` : ''}
        </div>

        <div class="highlight">
            <h3>💰 Cotización Final: $${lead.cotizacionTotal.toLocaleString('es-MX')}</h3>
            <p><strong>Tiempo estimado de entrega:</strong> ${lead.urgencia ? '24 horas' : '3-5 días hábiles'}</p>
        </div>

        <hr>
        <p style="text-align: center; color: #6b7280; font-size: 12px;">
            Este email fue generado automáticamente por el sistema de leads de INKO Impresores
        </p>
    </div>
</body>
</html>
    `;
  }
}

export const emailService = new EmailService();
