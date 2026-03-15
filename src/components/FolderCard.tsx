import { Folder, Users } from 'lucide-react';
import { Patient, Study } from '@/types';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/format';

interface FolderCardProps {
  item: Patient | Study;
  itemCount: number;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDoubleClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

function isPatient(item: Patient | Study): item is Patient {
  return 'email' in item;
}

export function FolderCard({
  item,
  itemCount,
  isSelected = false,
  onClick,
  onDoubleClick,
  onContextMenu,
}: FolderCardProps) {
  const patient = isPatient(item);

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-lg border-2 p-3 cursor-pointer transition-all',
        'hover:border-primary-300 hover:shadow-md',
        isSelected
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          : 'border-transparent bg-white dark:bg-gray-800'
      )}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      {/* Icon */}
      <div className="aspect-square mb-3 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
        <Folder className="w-16 h-16 text-blue-500" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate" title={item.name}>
          {item.name}
        </p>
        <div className="flex items-center justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
          <span>{formatDate(item.lastModified)}</span>
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
}
