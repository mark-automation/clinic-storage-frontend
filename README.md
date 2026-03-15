# Clinic Storage Frontend

A React + TypeScript frontend for a clinic storage management system with a Google Drive-style UI.

## Features

- **Google Drive-style Interface**: Familiar folder/file navigation with grid view
- **Patient Management**: Browse patients as folders
- **Study Organization**: View medical studies within each patient
- **File Management**: Upload, download, delete, and preview medical files
- **Drag & Drop Upload**: Easy file upload with progress indicator
- **Dark Mode**: Toggle between light and dark themes
- **Context Menus**: Right-click actions for files and folders
- **Multi-select**: Ctrl/Cmd+click to select multiple items
- **Breadcrumb Navigation**: Easy navigation back through the hierarchy
- **Trash**: Soft delete with restore functionality

## Tech Stack

- **Vite** - Fast build tool and dev server
- **React 18** - UI library with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Axios** - HTTP client (ready for real API)
- **Recharts** - Storage usage charts
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Demo Credentials

- **Email**: doctor@clinic.com
- **Password**: password

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Breadcrumb.tsx
│   ├── ContextMenu.tsx
│   ├── EmptyState.tsx
│   ├── FileCard.tsx
│   ├── FolderCard.tsx
│   ├── Sidebar.tsx
│   ├── StorageBar.tsx
│   ├── TopBar.tsx
│   └── UploadProgress.tsx
├── pages/              # Page components
│   ├── DashboardPage.tsx
│   ├── FilesPage.tsx
│   ├── LoginPage.tsx
│   ├── PatientsPage.tsx
│   ├── StudiesPage.tsx
│   └── TrashPage.tsx
├── hooks/              # Custom React hooks
│   ├── useAuth.ts
│   ├── useContextMenu.ts
│   ├── useDragAndDrop.ts
│   ├── useFiles.ts
│   ├── usePatients.ts
│   ├── useSelection.ts
│   ├── useStorage.ts
│   └── useStudies.ts
├── types/              # TypeScript types
│   └── index.ts
├── utils/              # Utility functions
│   ├── cn.ts
│   ├── format.ts
│   └── mockApi.ts
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Implemented

### Layout
- ✅ Top bar with search, user menu, and dark mode toggle
- ✅ Left sidebar with navigation and storage stats
- ✅ Main area with grid view
- ✅ Collapsible sidebar

### Views
- ✅ Login page with email/password
- ✅ Dashboard with storage chart and recent files
- ✅ Patient browser (folders in grid)
- ✅ Study viewer (folders in grid)
- ✅ File viewer (files in grid with preview)
- ✅ Trash (deleted items)

### Interactions
- ✅ Drag & drop upload
- ✅ Right-click context menu (Open, Download, Delete, Move)
- ✅ Double-click to open folder
- ✅ Breadcrumb navigation
- ✅ Multi-select with Ctrl/Cmd+click

### Components
- ✅ FileCard (thumbnail, name, size, date)
- ✅ FolderCard (icon, name, item count)
- ✅ ContextMenu (right-click menu)
- ✅ UploadProgress (drag overlay)
- ✅ StorageBar (usage visualization)

## Mock API

The app currently uses a mock API (`src/utils/mockApi.ts`) with sample data. To connect to a real backend:

1. Replace the mock API calls in the hooks with real axios calls
2. Update the API endpoints in the proxy config in `vite.config.ts`
3. Remove or update the mock data

## API Endpoints (Planned)

- `GET /api/patients` - List patients
- `GET /api/studies?patientId=X` - List studies for a patient
- `GET /api/files?studyId=X` - List files for a study
- `POST /api/files/upload` - Upload file
- `GET /api/files/{id}/download` - Download file
- `DELETE /api/files/{id}` - Delete file
- `POST /api/files/{id}/restore` - Restore deleted file
- `GET /api/storage/stats` - Get storage statistics

## Customization

### Colors
The app uses Tailwind's default color palette with a primary blue theme. Customize in `tailwind.config.js`:

```js
colors: {
  primary: {
    // Your brand colors
  }
}
```

### Icons
Icons are from [Lucide React](https://lucide.dev/). Replace or add icons as needed.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT
