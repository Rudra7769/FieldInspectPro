# Design Guidelines: Engineer Field Inspection App

## Architecture Decisions

### Authentication
**Auth Required** - This is a B2B enterprise application with backend integration.

**Implementation:**
- Email/password authentication with JWT (as specified by backend API)
- NO SSO - This is an internal enterprise tool assigned to specific engineers
- Session persists using AsyncStorage
- Login screen required on first launch
- Account screen includes:
  - Engineer profile (name, ID, assigned region)
  - Settings (notifications, sync preferences, cache management)
  - Log out with confirmation
  - App version and sync status indicator

### Navigation Structure
**Tab Navigation** (4 tabs with floating action button)

1. **Home Tab**: Dashboard showing assigned societies/flats
2. **Jobs Tab**: List of completed and pending jobs
3. **Floating Action Button**: Start New Inspection (center, elevated)
4. **Sync Queue Tab**: Pending uploads with sync status
5. **Profile Tab**: Engineer account and settings

**Navigation Stack Details:**
- Login Flow: Stack-only (Login → Dashboard)
- Main Flow: Tab navigator as root after authentication
- Modals: Job Form, Signature Capture, Photo Gallery (full-screen native modals)

## Screen Specifications

### 1. Login Screen
- **Purpose**: Authenticate engineer with credentials
- **Layout:**
  - No header (stack-only entry point)
  - Centered logo/app name at top third
  - Email input field
  - Password input field (with show/hide toggle)
  - "Login" button (full-width, primary color)
  - Loading state during authentication
  - Error message display area below button
- **Safe Areas:** Top: insets.top + 60, Bottom: insets.bottom + 40
- **Components:** TextInput (email), SecureTextInput (password), Button, StatusBanner (errors)

### 2. Dashboard Screen (Home Tab)
- **Purpose**: View assigned societies and flats for inspection
- **Layout:**
  - Header: "Assignments" title, right button for filter/sort
  - Main content: Scrollable list of assignment cards
  - Each card shows: Society name, flat numbers, address, urgency indicator
  - Pull-to-refresh enabled
  - Empty state: "No assignments" illustration
- **Safe Areas:** Top: headerHeight + Spacing.lg, Bottom: tabBarHeight + Spacing.xl
- **Components:** Card list, RefreshControl, FilterButton, StatusBadge

### 3. Job Form Screen (Modal)
- **Purpose**: Complete inspection with checklist, photos, signature, status
- **Layout:**
  - Header: "Inspection" title, left: Cancel, right: Save (disabled until signature captured)
  - Main content: Scrollable form with sections:
    - **Property Info** (read-only): Society, Flat, Address
    - **Checklist** (expandable sections): Electrical, Plumbing, Civil, etc. with checkboxes
    - **Status Dropdown**: Done / Client Not Available / Refused / Follow-up Needed
    - **Notes** (multi-line text area)
    - **Photos Section**: Horizontal scrollable gallery + "Add Photo" button (max 10 photos)
    - **Signature Section**: "Capture Signature" button → opens signature modal
    - **GPS Indicator**: Auto-captured coordinates with refresh icon
  - Submit button at bottom (only active when signature captured)
- **Safe Areas:** Top: Spacing.xl, Bottom: insets.bottom + Spacing.xl
- **Components:** SectionHeader, Checkbox, Dropdown, TextArea, ImageThumbnail, SignaturePreview, GPSBadge

### 4. Signature Capture Screen (Full-screen Modal)
- **Purpose**: Capture digital signature from client/engineer
- **Layout:**
  - Header: "Signature" title, left: Cancel, right: Confirm (only when signature present)
  - Main content: Full-screen canvas (white background, black ink)
  - Footer: "Clear" button (bottom-left), "Done" button (bottom-right)
- **Safe Areas:** Top: headerHeight, Bottom: insets.bottom + Spacing.lg
- **Components:** SignatureCanvas, ClearButton, DoneButton

### 5. Sync Queue Screen (Tab)
- **Purpose**: View pending job submissions and retry failed uploads
- **Layout:**
  - Header: "Sync Queue" title, right: "Sync All" button (active only when online)
  - Main content: List of queued jobs with status indicators
  - Each item shows: Job timestamp, society/flat, status (pending/syncing/failed), file size
  - Swipe actions: "Retry" for failed items, "Delete" with confirmation
  - Connection status banner at top (offline/online)
  - Empty state: "All synced" with checkmark icon
- **Safe Areas:** Top: headerHeight + Spacing.lg, Bottom: tabBarHeight + Spacing.xl
- **Components:** QueueCard, StatusBanner, SwipeActions, ConnectionIndicator

### 6. Job Details Screen (Stack)
- **Purpose**: View completed inspection details
- **Layout:**
  - Header: "Inspection Details" title, left: Back, right: Share icon
  - Main content: Scrollable read-only form showing all captured data
  - Sections: Property Info, Checklist (completed items highlighted), Status, Notes, Photos (grid view), Signature (thumbnail), GPS coordinates, Timestamp
- **Safe Areas:** Top: headerHeight + Spacing.lg, Bottom: insets.bottom + Spacing.xl
- **Components:** InfoCard, ChecklistView, PhotoGrid, SignatureThumbnail, MapPreview

## Design System

### Color Palette
**Primary:** #1976D2 (Professional Blue - reliability, trust)  
**Secondary:** #388E3C (Success Green - completed jobs)  
**Error:** #D32F2F (Alert Red - failures, urgent items)  
**Warning:** #F57C00 (Amber - follow-up needed)  
**Surface:** #FFFFFF (Card backgrounds)  
**Background:** #F5F5F5 (Screen backgrounds)  
**Text Primary:** #212121  
**Text Secondary:** #757575  
**Border:** #E0E0E0

### Typography
- **Header 1:** 24px, Bold (Screen titles)
- **Header 2:** 20px, SemiBold (Section headers)
- **Body:** 16px, Regular (Form labels, list items)
- **Caption:** 14px, Regular (Helper text, timestamps)
- **Button:** 16px, Medium (All-caps for primary actions)

### Component Specifications

**Cards:**
- Background: Surface color
- Border radius: 12px
- Padding: 16px
- Shadow: subtle elevation (shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 4)
- Touchable feedback: 60% opacity on press

**Buttons:**
- Primary: Filled with Primary color, white text, border-radius: 8px, height: 48px
- Secondary: Outlined with Primary color, primary text, border-radius: 8px, height: 48px
- Floating Action Button: 56x56px circle, Primary color, shadow: {width: 0, height: 4, opacity: 0.15, radius: 8}
- All buttons: Scale to 0.96 on press

**Status Indicators:**
- Done: Green background (#E8F5E9), green text
- Pending: Amber background (#FFF3E0), orange text
- Failed: Red background (#FFEBEE), red text
- Offline: Gray background (#F5F5F5), gray text
- Pill-shaped with 16px border-radius

**Form Inputs:**
- Height: 48px
- Border: 1px solid Border color
- Border-radius: 8px
- Focus state: Border changes to Primary color
- Error state: Border changes to Error color

### Icons & Assets
- Use **Feather icons** from @expo/vector-icons for all UI elements
- Required icons: camera, check-square, map-pin, upload-cloud, alert-circle, user, settings, log-out
- Icon size: 24px for tab bar, 20px for inline actions
- **NO custom assets needed** - This is a functional enterprise tool

### Interaction Patterns
- **Pull-to-refresh:** On all list screens for manual data refresh
- **Swipe actions:** On sync queue items for retry/delete
- **Haptic feedback:** On form submission, signature capture completion, sync success/failure
- **Loading states:** Spinner for sync operations, skeleton screens for data loading
- **Offline indicator:** Persistent banner when no connection detected
- **Auto-save:** Job form auto-saves to local storage every 30 seconds when offline

### Accessibility
- **Touch targets:** Minimum 44x44px for all interactive elements (critical for field use with gloves)
- **Contrast ratios:** WCAG AA compliant (4.5:1 for normal text)
- **Labels:** All form inputs have clear labels above or placeholder text
- **Error messages:** Descriptive, actionable text for validation errors
- **Screen reader support:** Proper accessibility labels for all touchable elements