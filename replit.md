# Overview

This is a mini agentic application for INKO Impresores, a large format printing company. The application captures leads from potential clients interested in printing services, provides real-time quotations using AI assistance, and manages lead data through automated workflows. The system features a React frontend for lead capture, an Express.js backend with AI integration, and connects to external services for data storage and notifications.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent UI components
- **State Management**: TanStack React Query for server state management and API interactions
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **Database Schema**: Drizzle ORM with PostgreSQL for type-safe database operations
- **API Design**: RESTful endpoints for lead management, quotation calculation, and WhatsApp message processing
- **Storage**: In-memory storage implementation with interfaces for easy database integration
- **Session Management**: Express sessions with PostgreSQL session store

## Core Business Logic
- **Material Catalog**: Predefined materials (lona, vinil, microperforado, PVC, acrílico) with pricing
- **Quotation Engine**: Real-time price calculation based on area, material, urgency multipliers, and installation costs
- **Lead Classification**: AI-powered lead scoring (alto, medio, bajo) based on project details and budget
- **Business Rules**: Minimum order amounts, urgency surcharges, and installation fees

## AI Integration
- **Provider**: OpenAI GPT integration for lead classification and WhatsApp message processing
- **Classification Logic**: Analyzes lead data to determine interest level and provides recommendations
- **Conversation Flow**: Processes WhatsApp messages to guide users through quotation process

# External Dependencies

## AI Services
- **OpenAI API**: Lead classification, WhatsApp conversation processing, and intelligent response generation

## Data Storage & Notifications
- **Google Sheets API**: Lead data storage and tracking in spreadsheet format
- **Email Service**: SMTP integration (Gmail) for automated lead notifications to INKO team
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL for production data persistence

## Development & Deployment
- **Replit Integration**: Development environment with runtime error handling and cartographer plugin
- **Vite Plugins**: Hot module replacement, error overlay, and development tooling
- **Environment Variables**: Secure configuration management for API keys and database credentials

## Third-Party UI Components
- **Radix UI**: Accessible component primitives for complex UI interactions
- **Embla Carousel**: Image and content carousel functionality
- **Date-fns**: Date manipulation and formatting utilities
- **Class Variance Authority**: Type-safe CSS class composition