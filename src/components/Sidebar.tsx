import { HardDrive, Clock, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { StorageBar } from './StorageBar';
import { StorageStats } from '@/types';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  storageStats?: StorageStats;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems = [
  { path: '/dashboard', label: 'My Drive', icon: HardDrive },
  { path: '/recent', label: 'Recent', icon: Clock },
  { path: '/trash', label: 'Trash', icon: Trash2 },
];

export function Sidebar({
  currentPath,
  onNavigate,
  storageStats,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        'bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Collapse toggle */}
      <div className="flex justify-end p-2">
        <button
          onClick={onToggleCollapse}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');

          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors',
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                isCollapsed && 'justify-center px-2'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary-600')} />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Storage stats */}
      {!isCollapsed && storageStats && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <StorageBar used={storageStats.usedSpace} total={storageStats.totalSpace} />
        </div>
      )}

      {/* Collapsed storage indicator */}
      {isCollapsed && storageStats && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-2">
          <div className="w-10 h-10 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-gray-500" />
          </div>
        </div>
      )}
    </aside>
  );
}
