import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface ContextMenuItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  isOpen: boolean;
  items: ContextMenuItem[];
  onClose: () => void;
}

export function ContextMenu({ x, y, isOpen, items, onClose }: ContextMenuProps) {
  if (!isOpen) return null;

  // Adjust position to keep menu on screen
  const adjustedX = Math.min(x, window.innerWidth - 200);
  const adjustedY = Math.min(y, window.innerHeight - items.length * 40);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      {/* Menu */}
      <div
        className="fixed z-50 min-w-[160px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1"
        style={{ left: adjustedX, top: adjustedY }}
      >
        {items.map((item, index) => (
          <button
            key={index}
            className={cn(
              'w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition-colors',
              item.disabled
                ? 'text-gray-400 cursor-not-allowed'
                : item.danger
                ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            )}
            onClick={() => {
              if (!item.disabled) {
                item.onClick();
                onClose();
              }
            }}
            disabled={item.disabled}
          >
            {item.icon && <span className="w-4 h-4">{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
