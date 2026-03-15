import { useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudy } from '@/hooks/useStudies';
import { useFiles, useUploadFile, useDeleteFile } from '@/hooks/useFiles';
import { useSelection } from '@/hooks/useSelection';
import { useContextMenu } from '@/hooks/useContextMenu';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { FileCard } from '@/components/FileCard';
import { ContextMenu } from '@/components/ContextMenu';
import { EmptyState } from '@/components/EmptyState';
import { Breadcrumb } from '@/components/Breadcrumb';
import { UploadProgress } from '@/components/UploadProgress';
import { FileItem } from '@/types';
import {
  FolderOpen,
  Download,
  Trash2,
  Move,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';

export function FilesPage() {
  const { patientId, studyId } = useParams<{ patientId: string; studyId: string }>();
  const navigate = useNavigate();
  const { data: study } = useStudy(studyId || '');
  const { data: files, isLoading } = useFiles(studyId);
  const uploadFile = useUploadFile();
  const deleteFile = useDeleteFile();
  const { selectedIds, toggleSelection, isSelected } = useSelection<FileItem>();
  const { x, y, isOpen, openContextMenu, closeContextMenu } = useContextMenu();
  const [contextFile, setContextFile] = useState<FileItem | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    async (droppedFiles: FileList) => {
      if (!studyId) return;

      for (const file of Array.from(droppedFiles)) {
        setIsUploading(true);
        setUploadProgress(0);

        await uploadFile.mutateAsync({
          studyId,
          file,
          onProgress: (progress) => setUploadProgress(progress),
        });

        setIsUploading(false);
      }
    },
    [studyId, uploadFile]
  );

  const { isDragging, dragHandlers } = useDragAndDrop({
    onDrop: handleDrop,
    disabled: !studyId,
  });

  const handleContextMenu = (e: React.MouseEvent, file: FileItem) => {
    setContextFile(file);
    openContextMenu(e);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleDrop(e.target.files);
    }
  };

  const contextMenuItems = [
    {
      label: 'Open',
      icon: <FolderOpen className="w-4 h-4" />,
      onClick: () => {
        if (contextFile) {
          console.log('Open file', contextFile.id);
        }
      },
    },
    {
      label: 'Download',
      icon: <Download className="w-4 h-4" />,
      onClick: () => {
        if (contextFile) {
          console.log('Download file', contextFile.id);
        }
      },
    },
    {
      label: 'Move',
      icon: <Move className="w-4 h-4" />,
      onClick: () => console.log('Move file', contextFile?.id),
    },
    {
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      danger: true,
      onClick: () => {
        if (contextFile) {
          deleteFile.mutate(contextFile.id);
        }
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-6 min-h-[calc(100vh-4rem)]"
      {...dragHandlers}
    >
      {/* Drag overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-40 bg-primary-500/20 border-4 border-primary-500 border-dashed m-4 rounded-xl flex items-center justify-center pointer-events-none">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl text-center">
            <Upload className="w-16 h-16 text-primary-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Drop files to upload
            </h3>
          </div>
        </div>
      )}

      {/* Upload progress */}
      <UploadProgress
        isVisible={isUploading}
        progress={uploadProgress}
        onCancel={() => setIsUploading(false)}
      />

      {/* Header */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: 'Patients', path: '/patients' },
            { label: study?.patientId || 'Patient', path: `/patients/${patientId}` },
            { label: study?.name || 'Study' },
          ]}
          onNavigate={navigate}
        />

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/patients/${patientId}`)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {study?.name || 'Study'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {files?.length || 0} files
              </p>
            </div>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Files
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Grid */}
      {files && files.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              isSelected={isSelected(file.id)}
              onClick={(e) => {
                const isMulti = e.ctrlKey || e.metaKey;
                toggleSelection(file.id, isMulti);
              }}
              onDoubleClick={() => console.log('Open file', file.id)}
              onContextMenu={(e) => handleContextMenu(e, file)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No files yet"
          description="Drag and drop files here or click Upload Files to add medical images and documents"
          icon="upload"
          action={{
            label: 'Upload Files',
            onClick: () => fileInputRef.current?.click(),
          }}
        />
      )}

      {/* Context menu */}
      <ContextMenu
        x={x}
        y={y}
        isOpen={isOpen}
        items={contextMenuItems}
        onClose={closeContextMenu}
      />
    </div>
  );
}
