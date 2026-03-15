import { FileText, Image, FileVideo, FileAudio, FileSpreadsheet, File } from 'lucide-react';
import { FileItem } from '@/types';
import { cn } from '@/utils/cn';
import { formatFileSize, formatDate, getFileIcon } from '@/utils/format';

interface FileCardProps {
  file: FileItem;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDoubleClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

const iconMap = {
  image: Image,
  video: FileVideo,
  audio: FileAudio,
  pdf: FileText,
  document: FileText,
  spreadsheet: FileSpreadsheet,
  file: File,
};

export function FileCard({
  file,
  isSelected = false,
  onClick,
  onDoubleClick,
  onContextMenu,
}: FileCardProps) {
  const iconType = getFileIcon(file.type);
  const Icon = iconMap[iconType as keyof typeof iconMap] || File;

  const isImage = file.type.startsWith('image/');

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
      {/* Thumbnail */}
      <div className="aspect-square mb-3 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden">
        {isImage && file.thumbnailUrl ? (
          <img
            src={file.thumbnailUrl}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon className="w-12 h-12 text-gray-400" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate" title={file.name}>
          {file.name}
        </p>
        <div className="flex items-center justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span>{formatFileSize(file.size)}</span>
          <span>{formatDate(file.modifiedAt)}</span>
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
