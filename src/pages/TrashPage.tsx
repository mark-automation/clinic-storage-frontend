import { useNavigate } from 'react-router-dom';
import { useDeletedFiles } from '@/hooks/useFiles';
import { useRestoreFile } from '@/hooks/useFiles';
import { useSelection } from '@/hooks/useSelection';
import { FileCard } from '@/components/FileCard';
import { EmptyState } from '@/components/EmptyState';
import { Breadcrumb } from '@/components/Breadcrumb';
import { FileItem } from '@/types';
import { RotateCcw, Trash2, AlertTriangle } from 'lucide-react';

export function TrashPage() {
  const navigate = useNavigate();
  const { data: files, isLoading } = useDeletedFiles();
  const restoreFile = useRestoreFile();
  const { selectedIds, toggleSelection, isSelected, selectedCount, clearSelection } =
    useSelection<FileItem>();

  const handleRestore = (fileId: string) => {
    restoreFile.mutate(fileId);
  };

  const handleRestoreSelected = () => {
    selectedIds.forEach((id) => restoreFile.mutate(id));
    clearSelection();
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Breadcrumb items={[{ label: 'Trash' }]} onNavigate={navigate} />

        <div className="flex items-center justify-between mt-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Trash
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {files?.length || 0} deleted items
            </p>
          </div>

          {selectedCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedCount} selected
              </span>
              <button
                onClick={handleRestoreSelected}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Restore Selected
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Warning */}
      <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Items in trash will be permanently deleted after 30 days.
          </p>
        </div>
      </div>

      {/* Grid */}
      {files && files.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {files.map((file) => (
            <div key={file.id} className="relative group">
              <FileCard
                file={file}
                isSelected={isSelected(file.id)}
                onClick={(e) => {
                  const isMulti = e.ctrlKey || e.metaKey;
                  toggleSelection(file.id, isMulti);
                }}
              />
              <button
                onClick={() => handleRestore(file.id)}
                className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-50 dark:hover:bg-primary-900/20"
                title="Restore"
              >
                <RotateCcw className="w-4 h-4 text-primary-600" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Trash is empty"
          description="Deleted files will appear here"
          icon="folder"
        />
      )}
    </div>
  );
}
