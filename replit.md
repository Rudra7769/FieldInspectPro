# Field Inspector - Engineer Field Inspection Mobile App

## Overview

Field Inspector is a cross-platform mobile application built with React Native and Expo for field engineers to conduct property inspections. The app enables engineers to complete on-site inspections of societies/flats, capture photos, collect signatures, and sync data with a backend API. It's designed as a B2B enterprise solution with offline-first capabilities and background sync functionality.

The application supports iOS, Android, and web platforms, with offline data persistence using SQLite on native platforms.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Platform**: React Native with Expo SDK 54
- Cross-platform support (iOS, Android, Web)
- Uses the new Expo architecture with React 19
- React Compiler enabled for optimizations

**Navigation Pattern**: Hybrid stack and tab navigation
- Stack navigator for authentication flow (Login → Main App)
- Bottom tab navigator with 4 main sections after authentication
- Floating action button (FAB) for creating new inspections
- Modal presentations for job forms and signature capture

**State Management**: Zustand for global state
- `authStore`: Manages user authentication, session persistence via AsyncStorage
- `jobStore`: Handles assignments, completed jobs, and sync queue
- No Redux - uses lightweight Zustand for simpler state management

**UI/UX Approach**:
- Custom theme system with light/dark mode support
- Consistent design tokens (spacing, typography, border radius, colors)
- Platform-adaptive components (native feel on iOS/Android, responsive on web)
- Safe area management for notches and system UI
- Keyboard-aware scrolling for form inputs

**Component Architecture**:
- Themed components (ThemedText, ThemedView) for automatic color scheme support
- Reusable screen wrappers (ScreenScrollView, ScreenKeyboardAwareScrollView, ScreenFlatList)
- Shared UI components (Button, Card, HeaderTitle, Spacer)
- Error boundary for graceful error handling

### Data Flow & Offline Strategy

**Offline-First Design**:
- Jobs are saved locally to SQLite on native platforms before attempting sync
- Queue system for failed uploads with retry mechanism
- Network status detection using @react-native-community/netinfo
- Graceful degradation on web (no local database, memory-only storage)

**Sync Architecture**:
- Jobs created offline are stored in `queued_jobs` table
- Background sync attempts when network is available
- Retry count tracking for failed syncs
- User-facing sync queue screen to monitor pending uploads

### Authentication System

**Implementation**: JWT-based authentication with demo credentials
- Email/password login (no SSO - internal enterprise tool)
- Session persistence using AsyncStorage
- Token-based API authentication via Axios interceptors
- Demo credentials: `demo@engineer.com` / `demo123`

**Session Management**:
- Automatic session restoration on app launch
- Logout with confirmation dialog
- Token expiration handling (via API interceptor)

### Data Storage

**Native Platforms (iOS/Android)**: SQLite via expo-sqlite
- `jobs` table: Stores completed inspections with sync status
- `queued_jobs` table: Pending uploads with retry metadata
- Automatic database initialization on app bootstrap
- Platform-specific implementation (database.native.ts)

**Web Platform**: No persistence
- Fallback to in-memory storage only
- Database operations are no-ops on web
- Prevents runtime errors from SQLite calls

**Rationale**: SQLite chosen for its reliability, zero-config setup on mobile, and built-in Expo support. Web doesn't need local persistence since it's primarily for testing/development.

### Location & Media Handling

**GPS Integration**: expo-location
- Captures coordinates during inspection for audit trail
- Permission handling with graceful fallback
- Stored with each completed job record

**Photo Capture**: expo-image-picker
- Multiple photo capture per inspection
- Camera and gallery access
- Photos stored as base64 or URIs for upload

**Signature Capture**: react-native-signature-canvas
- Canvas-based signature collection
- Full-screen modal presentation
- Signature saved as base64 image data

### External Dependencies

**Backend API**: 
- Base URL: `https://api.placeholder.com` (placeholder in demo)
- Endpoints:
  - `GET /engineer/assignments` - Fetch assigned properties
  - `GET /engineer/jobs` - Retrieve completed jobs
  - `POST /engineer/job` - Upload new inspection
  - `POST /upload/presigned` - Get S3 presigned URL for photo uploads
- Authentication: Bearer token in Authorization header

**Third-Party Services**:
- AWS S3: Photo storage via presigned URLs
- No other external integrations currently

**Key Libraries**:
- `axios`: HTTP client with interceptors for auth
- `zustand`: Lightweight state management
- `expo-sqlite`: Native database (mobile only)
- `react-native-signature-canvas`: Signature capture
- `@react-native-async-storage/async-storage`: Session persistence
- `@react-native-community/netinfo`: Network detection
- `react-navigation`: Navigation framework (stack + tabs)
- `expo-location`, `expo-image-picker`: Native device features

**Development Tools**:
- TypeScript for type safety
- Babel with module resolution for @/ path aliases
- ESLint + Prettier for code quality
- Replit-specific Metro bundler configuration

### Platform-Specific Considerations

**iOS/Android**:
- Native tab bar with SF Symbols (iOS) and Material icons (Android)
- Edge-to-edge display with safe area insets
- Gesture-based navigation
- SQLite database with full offline support

**Web**:
- Fallback to standard components where native APIs unavailable
- No database persistence (memory only)
- Keyboard handling via standard ScrollView instead of KeyboardAwareScrollView

**Replit Environment**:
- Custom Metro bundler proxy configuration for Replit domains
- Environment variables for REPLIT_DEV_DOMAIN and REPLIT_INTERNAL_APP_DOMAIN
- Static build script for deployment hosting