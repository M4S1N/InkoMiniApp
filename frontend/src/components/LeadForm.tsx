import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DollarSign, Send, Calculator, Flag, Palette, Grid, Square, Gem, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useToast } from '../hooks/useToast';

const materialIcons: Record<string, JSX.Element> = {
  Lona: <Flag size={32} />,
  Vinil: <Palette size={32} />,
  Microperforado: <Grid size={32} />,
  PVC: <Square size={32} />,
  Acrílico: <Gem size={32} />
};

const webhookLeadsUrl = 'https://inkomini.app.n8n.cloud/webhook/leads';
const pricesUrl = 'https://inkomini.app.n8n.cloud/webhook/loadprices';

const leadFormSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  contacto: z.string().min(5, "Ingresa un email o teléfono válido"),
  material: z.string({ required_error: "Selecciona un tipo de material" }),
  ancho: z.number().min(0.1, "El ancho debe ser mayor a 0.1 metros"),
  alto: z.number().min(0.1, "El alto debe ser mayor a 0.1 metros"),
  piezas: z.number().int().min(1, "Debe ser al menos 1 pieza"),
  instalacion: z.boolean().default(false),
  urgencia: z.boolean().default(false),
  comentarios: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

interface Material {
  Nombre: string;
  "MXN/m²": number;
}

interface PriceConfig {
  materials: Material[];
  installation?: number;
  urgency?: number;
  minimum?: number;
}

const LeadForm: React.FC = () => {
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [rules, setRules] = useState({ installation: 0, urgency: 0, minimum: 0 });
  const [loadingPrices, setLoadingPrices] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    document.body.style.overflow = loadingPrices ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [loadingPrices]);

  useEffect(() => {
    setLoadingPrices(true);
    fetch(pricesUrl)
      .then(res => res.json())
      .then((data: PriceConfig[]) => {
        if (Array.isArray(data) && data.length >= 2) {
          setMaterials(data[0].materials);
          setRules({
            installation: data[1].installation ?? 0,
            urgency: data[1].urgency ?? 0,
            minimum: data[1].minimum ?? 0,
          });
        }
      })
      .catch((err) => {
        showToast({
          title: "Error",
          description: err.message,
          type: "error"
        });
      })
      .finally(() => setLoadingPrices(false));
  }, [showToast]);

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      nombre: "",
      contacto: "",
      material: undefined,
      ancho: 0,
      alto: 0,
      piezas: 1,
      instalacion: false,
      urgencia: false,
      comentarios: "",
    },
  });

  function getQuoteResult(values: LeadFormData) {
    const mat = materials.find(m => m.Nombre === values.material);
    const price = mat ? mat["MXN/m²"] : 0;
    const area = values.ancho * values.alto * values.piezas;
    let total = price * area;
    if (values.instalacion) total += rules.installation;
    if (values.urgencia) total *= 1 + rules.urgency / 100;
    if (total < rules.minimum) total = rules.minimum;
    return {
      material: mat?.Nombre || values.material,
      area,
      subtotal: price * area,
      total: Math.round(total),
      instalacion: values.instalacion,
      urgencia: values.urgencia,
    };
  }

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    try {
      // Calcular cotización
      const quote = getQuoteResult(data);

      // Buscar el nombre largo del material
      const mat = materials.find(m => m.Nombre === data.material);
      const dataToSend = { ...data, material: mat?.Nombre || data.material };

      // Enviar a webhook
      const response = await fetch(webhookLeadsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        showToast({
          title: "¡Cotización enviada!",
          description: `Tu solicitud ha sido procesada. Cotización: $${quote.total.toLocaleString('es-MX')}`,
          type: 'success'
        });
        window.dispatchEvent(new CustomEvent('quote-updated', { detail: null }));
        form.reset();
        setSelectedMaterial("");
      } else {
        throw new Error('Error al enviar la solicitud');
      }
    } catch (error: any) {
      showToast({
        title: "Error",
        description: error.message,
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateQuote = () => {
    const values = form.getValues();
    if (values.material && values.ancho && values.alto && values.piezas) {
      setIsCalculating(true);
      try {
        const quote = getQuoteResult(values);
        window.dispatchEvent(new CustomEvent('quote-updated', { detail: quote }));
        showToast({
          title: "Cotización calculada",
          description: `Total estimado: $${quote.total.toLocaleString('es-MX')}`,
          type: 'success'
        });
      } catch (error: any) {
        showToast({
          title: "Error",
          description: error.message,
          type: 'error'
        });
      } finally {
        setIsCalculating(false);
      }
    } else {
      showToast({
        title: "Información incompleta",
        description: "Selecciona un material y completa las medidas",
        type: 'error'
      });
    }
  };

  const handleMaterialSelect = (material: string) => {
    setSelectedMaterial(material);
    form.setValue("material", material as any);
  };

  return (
    <div className="bg-card rounded-xl shadow-lg border border-border p-8 relative" id="cotizar">
      {loadingPrices && (
        <div className="loader-overlay">
          <Loader2 size={64} className="animate-spin text-accent" />
        </div>
      )}
      <div className="flex items-center mb-8">
        <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center mr-4">
          <DollarSign className="text-accent-foreground" size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-foreground">Solicitar Cotización</h3>
          <p className="text-muted-foreground">Completa los datos para recibir tu presupuesto instantáneo</p>
        </div>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="form-row">
          <div className="form-group">
            <label className="label">Nombre Completo *</label>
            <input
              type="text"
              className="input"
              placeholder="Tu nombre completo"
              data-testid="input-nombre"
              {...form.register("nombre")}
            />
            {form.formState.errors.nombre && (
              <p className="error">{form.formState.errors.nombre.message}</p>
            )}
          </div>
          <div className="form-group">
            <label className="label">Email o Teléfono *</label>
            <input
              type="text"
              className="input"
              placeholder="email@ejemplo.com o +52 55 1234 5678"
              data-testid="input-contacto"
              {...form.register("contacto")}
            />
            {form.formState.errors.contacto && (
              <p className="error">{form.formState.errors.contacto.message}</p>
            )}
          </div>
        </div>
        <div className="form-group">
          <label className="label">Tipo de Material *</label>
          <div className="material-grid">
            {materials.map(material => (
              <div
                key={material.Nombre}
                className={`material-item ${selectedMaterial === material.Nombre ? 'selected' : ''}`}
                onClick={() => handleMaterialSelect(material.Nombre)}
                data-testid={`material-${material.Nombre}`}
              >
                <div className="material-icon">
                  {
                    Object.entries(materialIcons).find(([key]) =>
                      material.Nombre.includes(key)
                    )?.[1] || <Square size={32} />
                  }
                </div>
                <h4 className="font-medium text-foreground">{material.Nombre}</h4>
                <p className="text-sm text-muted-foreground">${material["MXN/m²"]}/m²</p>
              </div>
            ))}
          </div>
          {form.formState.errors.material && (
            <p className="error">{form.formState.errors.material.message}</p>
          )}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="label">Ancho (metros) *</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              className="input"
              placeholder="2.0"
              data-testid="input-ancho"
              {...form.register("ancho", { valueAsNumber: true })}
            />
            {form.formState.errors.ancho && (
              <p className="error">{form.formState.errors.ancho.message}</p>
            )}
          </div>
          <div className="form-group">
            <label className="label">Alto (metros) *</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              className="input"
              placeholder="1.5"
              data-testid="input-alto"
              {...form.register("alto", { valueAsNumber: true })}
            />
            {form.formState.errors.alto && (
              <p className="error">{form.formState.errors.alto.message}</p>
            )}
          </div>
          <div className="form-group">
            <label className="label">Cantidad de Piezas *</label>
            <input
              type="number"
              min="1"
              className="input"
              placeholder="1"
              data-testid="input-piezas"
              {...form.register("piezas", { valueAsNumber: true })}
            />
            {form.formState.errors.piezas && (
              <p className="error">{form.formState.errors.piezas.message}</p>
            )}
          </div>
        </div>
        <div className="form-row">
          <div className="form-checkbox">
            <input
              type="checkbox"
              className="checkbox"
              data-testid="checkbox-instalacion"
              {...form.register("instalacion")}
            />
            <div>
              <label className="label">Instalación (+${rules.installation})</label>
              <p className="text-xs text-muted-foreground">Incluye montaje profesional</p>
            </div>
          </div>
          <div className="form-checkbox">
            <input
              type="checkbox"
              className="checkbox"
              data-testid="checkbox-urgencia"
              {...form.register("urgencia")}
            />
            <div>
              <label className="label">Urgencia 24h (+{rules.urgency}%)</label>
              <p className="text-xs text-muted-foreground">Entrega en 24 horas</p>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="label">Comentarios Adicionales</label>
          <textarea
            rows={4}
            className="textarea"
            placeholder="Describe cualquier detalle especial de tu proyecto..."
            data-testid="textarea-comentarios"
            {...form.register("comentarios")}
          />
          {form.formState.errors.comentarios && (
            <p className="error">{form.formState.errors.comentarios.message}</p>
          )}
        </div>
        <div className="form-buttons">
          <button
            type="submit"
            className="btn btn-primary flex-1"
            disabled={isSubmitting}
            data-testid="button-submit"
          >
            {isSubmitting ? (
              "Enviando..."
            ) : (
              <>
                <Send size={20} />
                Enviar Solicitud
              </>
            )}
          </button>
          <button
            type="button"
            className="btn btn-outline flex-1"
            onClick={calculateQuote}
            disabled={isCalculating}
            data-testid="button-calculate"
          >
            {isCalculating ? (
              "Calculando..."
            ) : (
              <>
                <Calculator size={20} />
                Calcular Cotización
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;
