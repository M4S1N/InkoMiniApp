# INKO Mini App – Prueba Técnica Agéntica

## 🎯 Objetivo

Construir una mini aplicación agéntica para INKO que:
- Capture leads interesados en impresión en gran formato.
- Oriente al lead sobre materiales/servicios vía WhatsApp (simulado con n8n).
- Califique el nivel de interés y genere cotización en tiempo real (texto).
- Guarde leads en Google Sheets.
- Envíe correo automático a INKO con la información del lead.

---

## 🔹 Arquitectura

- **Frontend:** React (Cursor compatible), desplegado en [https://inko-mini-app.vercel.app/](https://inko-mini-app.vercel.app/)
- **Automatización:** n8n, workflows en [https://inkomini.app.n8n.cloud/](https://inkomini.app.n8n.cloud/)
- **Base de datos:** [Google Sheets](https://docs.google.com/spreadsheets/d/1ozxPqtMGQ4Sv39VrtsceCAThTYrv-smArxQy6PxWu8Y/edit?gid=0#gid=0) (vía n8n)
- **Base de datos para memoria del agente:** Redis (Upstash). Persistencia de mensajes para que el agente recuerde conversaciones pasadas.
- **Notificación:** Correo electrónico: flavio@inkoimpresores.com (vía n8n)
- **IA:** Integración con OpenAI (o similar) para clasificación y cotización

**Flujo principal:**
1. Usuario llena formulario web o interactúa con el agente WhatsApp (simulado).
2. Datos capturados: nombre, contacto, material, dimensiones, cantidad, urgencia e instalacion.
3. IA clasifica el nivel de interés y genera cotización según reglas de INKO.
4. n8n guarda el lead en Google Sheets y envía correo a INKO.
5. El agente responde en WhatsApp con orientación y cotización.

---

## 🔹 Decisiones técnicas

- **React** para UI rápida y personalizable.
- **n8n** para orquestar automatizaciones, integración con Google Sheets y correo.
- **Google Sheets** como base de datos simple y accesible.
- **Redis (Upstash)** para persistencia de memoria del agente, manteniendo contexto entre mensajes y pedidos.
- **OpenAI API** para IA (clasificación y cotización).
- **Docker** para despliegue local y productivo.
- **Vercel** para hosting frontend.

---

## 🔹 Variables y credenciales necesarias

- **n8n:** API Key/credenciales para Google Sheets y correo.
- **OpenAI:** API Key para clasificación/cotización.
- **Redis (Upstash):** URL, username, password o API Key según configuración.
- **Correo destino:** Proporcionado por INKO.

---

## 🔹 Retos encontrados

- Integración estable entre n8n y Google Sheets (manejo de credenciales).
- Simulación de WhatsApp con experiencia realista.
- Manejo de CORS y despliegue en Vercel/n8n cloud.
- Memoria del agente para la persistencia de la informacion de una conversacion.

---

## 🔹 Mejoras con más tiempo

- Mejorar la experiencia conversacional del agente (más IA, contexto).
- Validaciones avanzadas en el formulario.
- Panel de administración para leads.
- Mejor manejo de errores y logs.
- Despliegue multi-idioma.

---

## 🔹 Variables/URLs principales

- **Frontend:** [https://inko-mini-app.vercel.app/](https://inko-mini-app.vercel.app/)
- **n8n Workflows:** [https://inkomini.app.n8n.cloud/](https://inkomini.app.n8n.cloud/)
- **Google Sheet:** [https://docs.google.com/spreadsheets](https://docs.google.com/spreadsheets/d/1ozxPqtMGQ4Sv39VrtsceCAThTYrv-smArxQy6PxWu8Y/edit?gid=0#gid=0)
- **Webhook precios:** `https://inkomini.app.n8n.cloud/webhook/loadprices`
- **Webhook leads/pedido:** `https://inkomini.app.n8n.cloud/webhook/pedido`

---

## 🔹 Entregables

- Formulario web con logotipo de INKO.
- Flujo WhatsApp simulado (n8n).
- Workflows n8n para registro y notificación.
- Código fuente y README.
- Link a Google Sheets con datos de prueba.
