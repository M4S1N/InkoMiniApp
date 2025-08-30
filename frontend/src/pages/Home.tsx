import React from 'react';
import { Calculator, FileText, Phone, Clock, Mail } from 'lucide-react';
import LeadForm from '../components/LeadForm';
import QuoteDisplay from '../components/QuoteDisplay';
import WhatsAppChat from '../components/WhatsAppChat';

const Home: React.FC = () => {
  const scrollToForm = () => {
    document.getElementById('cotizar')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">I</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-primary">INKO Impresores</h1>
                <p className="text-sm text-muted-foreground">Impresión en Gran Formato</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#servicios" className="text-muted-foreground hover:text-primary transition-colors">Servicios</a>
              <a href="#cotizar" className="text-muted-foreground hover:text-primary transition-colors">Cotizar</a>
              <a href="#contacto" className="text-muted-foreground hover:text-primary transition-colors">Contacto</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-slate-700 text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Impresión en Gran Formato
                <span className="text-accent"> de Alta Calidad</span>
              </h2>
              <p className="text-lg mb-8 text-primary-foreground/90">
                Especialistas en lona, vinil, microperforado, PVC y acrílico. 
                Obtén tu cotización en tiempo real con nuestro asistente inteligente.
              </p>
              <div className="hero-buttons">
                <button 
                  onClick={scrollToForm}
                  className="btn btn-primary"
                  data-testid="button-cotizar"
                >
                  <Calculator className="inline mr-2" size={20} />
                  Cotizar Ahora
                </button>
                <button 
                  onClick={() => document.getElementById('whatsapp-chat')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn btn-secondary"
                  data-testid="button-whatsapp"
                >
                  <svg className="inline mr-2" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.251"/>
                  </svg>
                  Chat WhatsApp
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-primary-foreground/10 rounded-2xl p-8 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-accent/20 rounded-lg p-4 text-center">
                    <FileText className="mx-auto text-3xl text-accent mb-2" size={32} />
                    <p className="text-sm font-medium">Lona & Vinil</p>
                  </div>
                  <div className="bg-accent/20 rounded-lg p-4 text-center">
                    <svg className="mx-auto text-3xl text-accent mb-2" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <p className="text-sm font-medium">PVC & Acrílico</p>
                  </div>
                  <div className="bg-accent/20 rounded-lg p-4 text-center">
                    <svg className="mx-auto text-3xl text-accent mb-2" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                    </svg>
                    <p className="text-sm font-medium">Instalación</p>
                  </div>
                  <div className="bg-accent/20 rounded-lg p-4 text-center">
                    <Clock className="mx-auto text-3xl text-accent mb-2" size={32} />
                    <p className="text-sm font-medium">Urgencias 24h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-12">
        <div className="main-layout">
          
          {/* Lead Form */}
          <div>
            <LeadForm />
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            <QuoteDisplay />
            <div id="whatsapp-chat">
              <WhatsAppChat />
            </div>
            
            {/* Contact Info */}
            <div className="bg-card rounded-xl shadow-lg border border-border p-6" id="contacto">
              <h4 className="text-lg font-bold text-foreground mb-4">Información de Contacto</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="text-accent" size={20} />
                  <span className="text-sm text-foreground">flavio@inkoimpresores.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="text-accent" size={20} />
                  <span className="text-sm text-foreground">+52 55 1234 5678</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="text-accent" size={20} />
                  <span className="text-sm text-foreground">Lun - Vie: 9:00 - 18:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 mt-16" id="servicios">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                  <span className="text-accent-foreground font-bold">I</span>
                </div>
                <h5 className="text-xl font-bold">INKO Impresores</h5>
              </div>
              <p className="text-primary-foreground/80 mb-4">
                Especialistas en impresión en gran formato con más de 10 años de experiencia 
                brindando soluciones de alta calidad.
              </p>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Servicios</h6>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>Impresión en Lona</li>
                <li>Vinil Adhesivo</li>
                <li>Microperforado</li>
                <li>PVC y Acrílico</li>
                <li>Instalación Profesional</li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Tecnología</h6>
              <div className="text-primary-foreground/80 text-sm">
                <p className="mb-2">• Asistente IA para cotizaciones</p>
                <p className="mb-2">• Integración con n8n</p>
                <p className="mb-2">• Base de datos en Google Sheets</p>
                <p>• Notificaciones automáticas</p>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
            <p>&copy; 2024 INKO Impresores. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
