import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { DollarSign, Send, Calculator, Flag, Palette, Grid, Square, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { leadFormSchema, type LeadFormData, MATERIALS } from "@shared/schema";
import MaterialCard from "./material-card";

const materialIcons = {
  lona: <Flag size={32} />,
  vinil: <Palette size={32} />,
  microperforado: <Grid size={32} />,
  pvc: <Square size={32} />,
  acrilico: <Gem size={32} />
};

export default function LeadForm() {
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const { toast } = useToast();

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

  const submitLeadMutation = useMutation({
    mutationFn: async (data: LeadFormData) => {
      const response = await apiRequest("POST", "/api/leads", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "¡Cotización enviada!",
        description: `Tu solicitud ha sido procesada. Cotización: $${data.lead.cotizacion.toLocaleString('es-MX')}`,
      });
      form.reset();
      setSelectedMaterial("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Error al enviar la solicitud",
        variant: "destructive",
      });
    },
  });

  const calculateQuoteMutation = useMutation({
    mutationFn: async (data: Partial<LeadFormData>) => {
      const response = await apiRequest("POST", "/api/calculate-quote", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Cotización calculada",
        description: `Total estimado: $${data.total.toLocaleString('es-MX')}`,
      });
    },
  });

  const onSubmit = (data: LeadFormData) => {
    submitLeadMutation.mutate(data);
  };

  const calculateQuote = () => {
    const values = form.getValues();
    if (values.material && values.ancho && values.alto) {
      calculateQuoteMutation.mutate(values);
    } else {
      toast({
        title: "Información incompleta",
        description: "Selecciona un material y completa las medidas",
        variant: "destructive",
      });
    }
  };

  const handleMaterialSelect = (material: string) => {
    setSelectedMaterial(material);
    form.setValue("material", material as any);
  };

  return (
    <div className="bg-card rounded-xl shadow-lg border border-border p-8" id="cotizar">
      <div className="flex items-center mb-8">
        <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center mr-4">
          <DollarSign className="text-accent-foreground" size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-foreground">Solicitar Cotización</h3>
          <p className="text-muted-foreground">Completa los datos para recibir tu presupuesto instantáneo</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu nombre completo" data-testid="input-nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contacto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email o Teléfono *</FormLabel>
                  <FormControl>
                    <Input placeholder="email@ejemplo.com o +52 55 1234 5678" data-testid="input-contacto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Material Selection */}
          <div>
            <Label className="block text-sm font-medium text-foreground mb-4">
              Tipo de Material *
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(MATERIALS).map(([key, material]) => (
                <MaterialCard
                  key={key}
                  material={key}
                  name={material.name}
                  price={material.price}
                  icon={materialIcons[key as keyof typeof materialIcons]}
                  selected={selectedMaterial === key}
                  onClick={() => handleMaterialSelect(key)}
                />
              ))}
            </div>
            {form.formState.errors.material && (
              <p className="text-sm font-medium text-destructive mt-2">
                {form.formState.errors.material.message}
              </p>
            )}
          </div>

          {/* Measurements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="ancho"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ancho (metros) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.1" 
                      min="0.1"
                      placeholder="2.0" 
                      data-testid="input-ancho"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alto (metros) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.1" 
                      min="0.1"
                      placeholder="1.5" 
                      data-testid="input-alto"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="piezas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad de Piezas *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1"
                      placeholder="1" 
                      data-testid="input-piezas"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Additional Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="instalacion"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="checkbox-instalacion"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Instalación (+$500)
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">Incluye montaje profesional</p>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="urgencia"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="checkbox-urgencia"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Urgencia 24h (+30%)
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">Entrega en 24 horas</p>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Comments */}
          <FormField
            control={form.control}
            name="comentarios"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comentarios Adicionales</FormLabel>
                <FormControl>
                  <Textarea 
                    rows={4}
                    placeholder="Describe cualquier detalle especial de tu proyecto..."
                    data-testid="textarea-comentarios"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              type="submit" 
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={submitLeadMutation.isPending}
              data-testid="button-submit"
            >
              {submitLeadMutation.isPending ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="mr-2" size={20} />
                  Enviar Solicitud
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={calculateQuote}
              className="flex-1 border-accent text-accent hover:bg-accent/10"
              disabled={calculateQuoteMutation.isPending}
              data-testid="button-calculate"
            >
              {calculateQuoteMutation.isPending ? (
                "Calculando..."
              ) : (
                <>
                  <Calculator className="mr-2" size={20} />
                  Calcular Cotización
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
