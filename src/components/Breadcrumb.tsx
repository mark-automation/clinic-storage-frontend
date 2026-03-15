import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/utils/cn';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate?: (path: string) => void;
}

export function Breadcrumb({ items, onNavigate }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-sm">
      <button
        onClick={() => onNavigate?.('/dashboard')}
        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
      >
        <Home className="w-4 h-4 text-gray-500" />
      </button>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
          {item.path && index < items.length - 1 ? (
            <button
              onClick={() => onNavigate?.(item.path!)}
              className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300 transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="px-2 py-1 font-medium text-gray-900 dark:text-white">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
