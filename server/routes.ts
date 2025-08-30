import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { leadFormSchema, whatsappMessageSchema, MATERIALS, BUSINESS_RULES } from "@shared/schema";
import { classifyLead, processWhatsAppMessage } from "./services/openai";
import { googleSheetsService } from "./services/googleSheets";
import { emailService } from "./services/emailService";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Calculate quotation
  app.post("/api/calculate-quote", async (req, res) => {
    try {
      const { material, ancho, alto, piezas, instalacion, urgencia } = req.body;
      
      if (!material || !MATERIALS[material as keyof typeof MATERIALS]) {
        return res.status(400).json({ error: "Material no válido" });
      }
      
      const materialData = MATERIALS[material as keyof typeof MATERIALS];
      const area = ancho * alto * piezas;
      let subtotal = area * materialData.price;
      
      if (urgencia) {
        subtotal *= BUSINESS_RULES.URGENCY_MULTIPLIER;
      }
      
      if (instalacion) {
        subtotal += BUSINESS_RULES.INSTALLATION_COST;
      }
      
      const total = Math.max(subtotal, BUSINESS_RULES.MINIMUM_ORDER);
      
      res.json({
        material: materialData.name,
        area: area,
        subtotal: subtotal,
        total: total,
        instalacion: instalacion,
        urgencia: urgencia
      });
    } catch (error) {
      console.error("Error calculating quote:", error);
      res.status(500).json({ error: "Error al calcular cotización" });
    }
  });

  // Submit lead form
  app.post("/api/leads", async (req, res) => {
    try {
      const validatedData = leadFormSchema.parse(req.body);
      
      // Calculate quotation
      const materialData = MATERIALS[validatedData.material];
      const area = validatedData.ancho * validatedData.alto * validatedData.piezas;
      let cotizacionTotal = area * materialData.price;
      
      if (validatedData.urgencia) {
        cotizacionTotal *= BUSINESS_RULES.URGENCY_MULTIPLIER;
      }
      
      if (validatedData.instalacion) {
        cotizacionTotal += BUSINESS_RULES.INSTALLATION_COST;
      }
      
      cotizacionTotal = Math.max(cotizacionTotal, BUSINESS_RULES.MINIMUM_ORDER);
      
      // Classify lead with AI
      const classification = await classifyLead({
        ...validatedData,
        cotizacionTotal
      });
      
      // Create lead in storage
      const leadData = {
        ...validatedData,
        cotizacionTotal,
        nivelInteres: classification.nivelInteres,
        clasificacionIA: classification.razonamiento
      };
      
      const lead = await storage.createLead(leadData);
      
      // Save to Google Sheets (async)
      googleSheetsService.saveLead(lead).catch(console.error);
      
      // Send email notification (async)
      emailService.sendLeadNotification(lead).catch(console.error);
      
      res.status(201).json({
        success: true,
        lead: {
          id: lead.id,
          cotizacion: cotizacionTotal,
          nivelInteres: classification.nivelInteres,
          recomendaciones: classification.recomendaciones
        }
      });
    } catch (error) {
      console.error("Error creating lead:", error);
      res.status(400).json({ 
        error: "Error al procesar solicitud",
        details: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  });

  // WhatsApp message processing
  app.post("/api/whatsapp", async (req, res) => {
    try {
      const { message } = whatsappMessageSchema.parse(req.body);
      
      const response = await processWhatsAppMessage(message);
      
      res.json({
        response: response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error processing WhatsApp message:", error);
      res.status(400).json({ 
        error: "Error al procesar mensaje",
        response: "Lo siento, no pude procesar tu mensaje. ¿Podrías repetirlo?"
      });
    }
  });

  // Get all leads (for admin)
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Error al obtener leads" });
    }
  });

  // Webhook endpoint for n8n
  app.post("/api/webhook/n8n", async (req, res) => {
    try {
      console.log("n8n webhook received:", req.body);
      
      // Process the webhook data
      // This endpoint can be used by n8n to trigger additional workflows
      
      res.json({
        success: true,
        message: "Webhook processed successfully",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error processing n8n webhook:", error);
      res.status(500).json({ error: "Error processing webhook" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      services: {
        storage: "active",
        openai: process.env.OPENAI_API_KEY ? "configured" : "missing",
        googleSheets: process.env.GOOGLE_SHEETS_API_KEY ? "configured" : "missing",
        email: process.env.GMAIL_USER ? "configured" : "missing"
      }
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
