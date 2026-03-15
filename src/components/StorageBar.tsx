import { HardDrive } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatFileSize } from '@/utils/format';

interface StorageBarProps {
  used: number;
  total: number;
  className?: string;
}

export function StorageBar({ used, total, className }: StorageBarProps) {
  const percentage = Math.min((used / total) * 100, 100);
  
  let colorClass = 'bg-green-500';
  if (percentage > 70) colorClass = 'bg-yellow-500';
  if (percentage > 90) colorClass = 'bg-red-500';

  return (
    <div className={cn('p-4', className)}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <HardDrive className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">Storage</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatFileSize(used)} of {formatFileSize(total)} used
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
        {percentage.toFixed(1)}% used
      </p>
    </div>
  );
}
