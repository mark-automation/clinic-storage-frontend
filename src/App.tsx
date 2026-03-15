import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useStorageStats } from '@/hooks/useStorage';
import { TopBar } from '@/components/TopBar';
import { Sidebar } from '@/components/Sidebar';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { PatientsPage } from '@/pages/PatientsPage';
import { StudiesPage } from '@/pages/StudiesPage';
import { FilesPage } from '@/pages/FilesPage';
import { TrashPage } from '@/pages/TrashPage';
import { cn } from '@/utils/cn';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Main layout with sidebar and topbar
function MainLayout({
  user,
  isDarkMode,
  onToggleDarkMode,
  onLogout,
}: {
  user: { id: string; email: string; name: string } | null;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: storageStats } = useStorageStats();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <TopBar
        user={user}
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
        onLogout={onLogout}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          currentPath={location.pathname}
          onNavigate={navigate}
          storageStats={storageStats}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/patients/:patientId" element={<StudiesPage />} />
            <Route path="/patients/:patientId/studies/:studyId" element={<FilesPage />} />
            <Route path="/trash" element={<TrashPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// App content with auth
function AppContent() {
  const { user, isLoading, error, login, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' ||
        (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage
              onLogin={handleLogin}
              isLoading={isLoading}
              error={error}
            />
          )
        }
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout
              user={user}
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
              onLogout={logout}
            />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

// Main App component
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/clinic-storage-frontend">
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
