import React, { useState, useEffect } from 'react';
import { Calculator, Info } from 'lucide-react';

interface Quote {
  material?: string;
  area?: number;
  subtotal?: number;
  total?: number;
  instalacion?: boolean;
  urgencia?: boolean;
}

const QuoteDisplay: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);

  // Listen for quote calculations from the form
  useEffect(() => {
    const handleQuoteUpdate = (event: CustomEvent) => {
      setQuote(event.detail);
    };

    window.addEventListener('quote-updated', handleQuoteUpdate as EventListener);
    return () => {
      window.removeEventListener('quote-updated', handleQuoteUpdate as EventListener);
    };
  }, []);

  return (
    <div className="quote-display">
      <div className="quote-header">
        <h4 className="text-xl font-bold mb-2">Cotización Estimada</h4>
        <p className="text-accent-foreground/90">Calcula tu presupuesto en tiempo real</p>
      </div>
      <div className="quote-content">
        <div id="quoteResult" className="space-y-4" data-testid="quote-display">
          {quote ? (
            <div className="space-y-4">
              <div className="quote-item">
                <span className="text-sm font-medium text-muted-foreground">Material:</span>
                <span className="font-semibold text-foreground" data-testid="text-material">
                  {quote.material}
                </span>
              </div>
              <div className="quote-item">
                <span className="text-sm font-medium text-muted-foreground">Área total:</span>
                <span className="font-semibold text-foreground" data-testid="text-area">
                  {quote.area?.toFixed(2)} m²
                </span>
              </div>
              {quote.instalacion && (
                <div className="quote-item text-accent">
                  <span className="text-sm font-medium">Instalación:</span>
                  <span className="font-semibold">+$500</span>
                </div>
              )}
              {quote.urgencia && (
                <div className="quote-item text-accent">
                  <span className="text-sm font-medium">Urgencia 24h:</span>
                  <span className="font-semibold">+30%</span>
                </div>
              )}
              <div className="quote-total">
                <div className="quote-item">
                  <span className="text-lg font-bold text-foreground">Total:</span>
                  <span className="text-2xl font-bold text-accent" data-testid="text-total">
                    ${quote.total?.toLocaleString('es-MX')}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">*Precios en pesos mexicanos</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-sm text-muted-foreground">
                  <Info className="inline mr-1" size={16} />
                  Cotización válida por 15 días. Entrega estimada: {quote.urgencia ? '24 horas' : '3-5 días hábiles'}.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calculator className="mx-auto text-4xl mb-4" size={64} />
              <p>Selecciona un material y completa las medidas para ver tu cotización</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteDisplay;
