########### Overview

This is a URL shortening service built with React (frontend) and Express.js (backend). The application allows users to submit long URLs and receive shortened versions, similar to services like bit.ly or tinyurl. The system features a modern web interface built with React and shadcn/ui components, backed by a REST API that handles URL shortening logic and storage.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: s hadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management** : TanStack Query (Re act Query) for server state management
- **Routing**: Wouter f or lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Request Handling**: Expres s middleware for JSON parsing, URL encoding, and request logging
- **Error Handling**: Centralized error middleware with structured error responses

## Data Storage
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development and PostgreSQL for production
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple

## Development and Build Process
- **Development Server**: Vite dev server with HMR integrated with Express backend
- **Production Build**: Vite builds static assets, esbuild bundles server code
- **Type Safety**: Shared TypeScript schemas between frontend and backend
- **Code Quality**: ESLint and TypeScript strict mode for code validation

## Key Features
- **URL Shortening**: Generate unique short codes for long URLs with collision detection
- **Duplicate Prevention**: Check for existing URLs before creating new short codes
- **URL Management**: Display recent URLs with copy, delete, and external link functionality
- **Responsive Design**: Mobile-first design with responsive breakpoints
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Real-time Updates**: Automatic UI updates when URLs are created or deleted

# External Dependencies

## Database
- **Neon PostgreSQL**: Serverless PostgreSQL database for production
- **Connection**: Uses DATABASE_URL environment variable for connection string
- **Features**: Supports connection pooling and serverless scaling

## UI and Styling
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: Web fonts (DM Sans, Fira Code, Geist Mono, Architects Daughter)

## Development Tools
- **Replit Integration**: Vite plugins for Replit development environment
- **Development Banner**: Replit dev banner for development mode detection
- **Runtime Error Overlay**: Development error handling and debugging

## Validation and Forms
- **Zod**: Schema validation for API requests and form data
- **React Hook Form**: Form state management and validation
- **Drizzle Zod**: Integration between Drizzle ORM and Zod schemas

## Utilities
- **date-fns**: Date manipulation and formatting
- **clsx/class-variance-authority**: Conditional CSS class management
- **nanoid**: Secure URL-friendly unique ID generation
