import { Upload, X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface UploadProgressProps {
  isVisible: boolean;
  progress: number;
  fileName?: string;
  onCancel?: () => void;
}

export function UploadProgress({ isVisible, progress, fileName, onCancel }: UploadProgressProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Upload className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Uploading...</h3>
              {fileName && (
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                  {fileName}
                </p>
              )}
            </div>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={cn(
              'absolute inset-y-0 left-0 bg-primary-500 rounded-full transition-all duration-300',
              progress === 100 && 'bg-green-500'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{progress}%</span>
          <span>{progress === 100 ? 'Complete!' : 'Uploading...'}</span>
        </div>
      </div>
    </div>
  );
}
