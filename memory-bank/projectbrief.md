# Project Brief

## Project Overview
**Twilight Hub** - A collaborative workspace platform built with Next.js, focusing on file management, team collaboration, and project organization.

## Core Features
- **Spaces Management**: Collaborative workspaces for teams
- **File Explorer**: Advanced file management with upload, download, and organization
- **Participants Management**: Team member roles and permissions
- **Organizations**: Multi-tenant organization structure
- **Real-time Collaboration**: Firebase-powered real-time updates

## Technology Stack
- **Frontend**: Next.js 14 with App Router
- **UI Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui components
- **State Management**: React Hooks (useState, useEffect, custom hooks)
- **Database**: Firebase Firestore
- **Styling**: Tailwind CSS
- **File Storage**: Firebase Storage

## Current Focus
**File Explorer Enhancement**: Implementing thumbnail and detail views for improved file browsing experience.

## Architecture Principles
- **Modular Design**: Features organized in `src/features/` with clear boundaries
- **Component Hierarchy**: `features` → `components` → `shared`
- **Single Responsibility**: Each component has one clear purpose
- **Minimal Abstraction**: Avoid over-engineering, prefer direct solutions
- **Modern UX**: SPA experience with responsive design and accessibility

## Development Standards
- **Code Style**: TypeScript strict mode
- **Component Structure**: Functional components with hooks
- **File Organization**: Feature-based structure with barrel exports
- **Testing**: Unit tests for critical logic
- **Documentation**: Comprehensive inline documentation
