# INKO Impresores - Aplicación Simplificada

Una aplicación React simplificada para INKO Impresores que permite solicitar cotizaciones de impresión en gran formato.

## Características

- ✅ Formulario de cotización con validación
- ✅ Selección de materiales (Lona, Vinil, Microperforado, PVC, Acrílico)
- ✅ Cálculo de cotizaciones en tiempo real
- ✅ Chat de WhatsApp integrado
- ✅ Diseño responsive y moderno
- ✅ Animaciones y efectos visuales
- ✅ Integración con webhooks de n8n

## Tecnologías Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipado estático
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **Lucide React** - Iconos
- **CSS Personalizado** - Estilos sin Tailwind

## Instalación

1. Clona el repositorio:
```bash
git clone <tu-repositorio>
cd inko-mini-app-simple
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm start
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
src/
├── components/
│   ├── LeadForm.tsx          # Formulario principal de cotización
│   ├── QuoteDisplay.tsx      # Visualización de cotizaciones
│   └── WhatsAppChat.tsx      # Chat de WhatsApp
├── hooks/
│   └── useToast.ts           # Hook para notificaciones
├── pages/
│   └── Home.tsx              # Página principal
├── App.tsx                   # Componente raíz
├── App.css                   # Estilos de la aplicación
├── index.tsx                 # Punto de entrada
└── index.css                 # Estilos globales
```

## Configuración de Webhooks

La aplicación está configurada para enviar datos a endpoints de n8n:

- **Formulario de cotización**: `POST /api/leads`
- **Cálculo de cotización**: `POST /api/calculate-quote`
- **Chat de WhatsApp**: `POST /api/whatsapp`

### Ejemplo de datos enviados:

```json
{
  "nombre": "Juan Pérez",
  "contacto": "juan@email.com",
  "material": "lona",
  "ancho": 2.5,
  "alto": 1.8,
  "piezas": 1,
  "instalacion": true,
  "urgencia": false,
  "comentarios": "Para evento corporativo"
}
```

## Materiales y Precios

| Material | Precio por m² |
|----------|---------------|
| Lona | $120 |
| Vinil | $180 |
| Microperforado | $220 |
| PVC | $280 |
| Acrílico | $350 |

### Servicios Adicionales

- **Instalación**: +$500
- **Urgencia 24h**: +30% del total

## Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas
- `npm run eject` - Expone la configuración de webpack (irreversible)

## Personalización

### Colores

Los colores se pueden personalizar modificando las variables CSS en `src/index.css`:

```css
:root {
  --primary: hsl(215, 84%, 24%);
  --accent: hsl(24, 95%, 53%);
  --background: hsl(210, 40%, 98%);
  /* ... más variables */
}
```

### Materiales

Los materiales y precios se pueden modificar en `src/components/LeadForm.tsx`:

```typescript
const MATERIALS = {
  lona: { name: 'Lona', price: 120 },
  vinil: { name: 'Vinil', price: 180 },
  // ... más materiales
};
```

## Despliegue

Para desplegar la aplicación:

1. Construye la aplicación:
```bash
npm run build
```

2. Los archivos de producción estarán en la carpeta `build/`

3. Sube el contenido de `build/` a tu servidor web

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto

INKO Impresores - [flavio@inkoimpresores.com](mailto:flavio@inkoimpresores.com)

---

Desarrollado con ❤️ para INKO Impresores
