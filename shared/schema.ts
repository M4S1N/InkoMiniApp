import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull(),
  contacto: text("contacto").notNull(),
  material: text("material").notNull(),
  ancho: real("ancho").notNull(),
  alto: real("alto").notNull(),
  piezas: integer("piezas").notNull().default(1),
  instalacion: boolean("instalacion").notNull().default(false),
  urgencia: boolean("urgencia").notNull().default(false),
  comentarios: text("comentarios"),
  cotizacionTotal: real("cotizacion_total").notNull(),
  nivelInteres: text("nivel_interes").notNull(), // alto, medio, bajo
  clasificacionIA: text("clasificacion_ia"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

export const leadFormSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  contacto: z.string().min(5, "Ingresa un email o teléfono válido"),
  material: z.enum(["lona", "vinil", "microperforado", "pvc", "acrilico"], {
    required_error: "Selecciona un tipo de material"
  }),
  ancho: z.number().min(0.1, "El ancho debe ser mayor a 0.1 metros"),
  alto: z.number().min(0.1, "El alto debe ser mayor a 0.1 metros"),
  piezas: z.number().int().min(1, "Debe ser al menos 1 pieza"),
  instalacion: z.boolean().default(false),
  urgencia: z.boolean().default(false),
  comentarios: z.string().optional(),
});

export const whatsappMessageSchema = z.object({
  message: z.string().min(1, "El mensaje no puede estar vacío"),
  sessionId: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
export type LeadFormData = z.infer<typeof leadFormSchema>;
export type WhatsAppMessage = z.infer<typeof whatsappMessageSchema>;

// Material pricing data
export const MATERIALS = {
  lona: { name: 'Lona', price: 120 },
  vinil: { name: 'Vinil', price: 180 },
  microperforado: { name: 'Microperforado', price: 220 },
  pvc: { name: 'PVC', price: 280 },
  acrilico: { name: 'Acrílico', price: 350 }
} as const;

// Business rules
export const BUSINESS_RULES = {
  MINIMUM_ORDER: 800,
  URGENCY_MULTIPLIER: 1.30, // +30%
  INSTALLATION_COST: 500,
} as const;
