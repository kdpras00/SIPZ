# Zakat Information Management System (SIPZ)

## Overview

SIPZ (Sistem Informasi Pengelolaan Zakat) is a comprehensive web application for managing Islamic zakat calculations, payments, and charitable contributions (infaq & shadaqoh). The system provides tools for calculating various types of zakat, tracking payments, managing notifications, and generating reports.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful API endpoints with JSON responses

### Database Design
- **ORM**: Drizzle ORM with TypeScript-first approach
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Validation**: Zod schemas for runtime validation and type inference
- **Tables**: Users, zakat calculations, zakat payments, infaq/shadaqoh records, notifications, and notification settings

## Key Components

### Zakat Calculator
- **Purpose**: Calculate different types of zakat (income, gold, trade, agriculture)
- **Features**: Real-time calculations, nisab threshold checking, multiple calculation methods
- **Validation**: Form validation with proper error handling

### Payment Management
- **Scheduling**: Automated payment scheduling and reminders
- **Status Tracking**: Track payment statuses (scheduled, paid, overdue)
- **Notifications**: Email and in-app notifications for upcoming payments

### Infaq & Shadaqoh Tracking
- **Recording**: Log charitable contributions with categories
- **History**: Maintain detailed records of all contributions
- **Reporting**: Generate summaries and reports for tax purposes

### Dashboard & Reporting
- **Analytics**: Yearly summaries, payment statistics, and trends
- **Visualization**: Charts and graphs using Recharts
- **Export**: PDF report generation capabilities

## Data Flow

1. **User Input**: Forms collect zakat calculation parameters or payment information
2. **Validation**: Client-side validation with Zod schemas before submission
3. **API Processing**: Express.js endpoints process requests and interact with database
4. **Database Operations**: Drizzle ORM handles all database interactions
5. **Response**: JSON responses sent back to client with success/error status
6. **UI Updates**: React Query automatically updates UI based on server responses
7. **Notifications**: Background jobs trigger notifications for scheduled payments

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection for Neon Database
- **drizzle-orm**: TypeScript ORM for database operations
- **express**: Web application framework for Node.js
- **react**: Frontend UI library
- **@tanstack/react-query**: Server state management and caching

### UI Dependencies
- **@radix-ui/***: Accessible component primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **react-hook-form**: Form library with validation support

### Development Dependencies
- **typescript**: Type checking and compilation
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for Node.js development

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite development server with HMR for frontend
- **Backend**: tsx with nodemon-like behavior for automatic restarts
- **Database**: Direct connection to Neon Database with development credentials

### Production Build Process
1. **Frontend Build**: Vite builds optimized React application to `dist/public`
2. **Backend Build**: esbuild compiles TypeScript server code to `dist/index.js`
3. **Static Assets**: Frontend assets served from `dist/public` directory
4. **Database Migrations**: Drizzle Kit handles schema migrations

### Production Deployment
- **Server**: Single Node.js process serving both API and static files
- **Database**: Neon Database (serverless PostgreSQL) for production
- **Environment Variables**: `DATABASE_URL` for database connection
- **Session Storage**: PostgreSQL-backed session store for user sessions

### Key Architectural Decisions

1. **Monorepo Structure**: Single repository with shared schema between client and server
2. **TypeScript Throughout**: End-to-end type safety from database to frontend
3. **Serverless Database**: Neon Database chosen for automatic scaling and reduced maintenance
4. **Component Library**: shadcn/ui provides consistent, accessible components
5. **Form Validation**: Zod schemas shared between client and server for consistent validation
6. **Islamic Theme**: Custom CSS variables and color scheme for Islamic application context

The system is designed to be maintainable, scalable, and user-friendly for managing Islamic financial obligations and charitable contributions.