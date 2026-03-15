export interface Patient {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  studyCount: number;
  lastModified: string;
}

export interface Study {
  id: string;
  patientId: string;
  name: string;
  description: string;
  fileCount: number;
  lastModified: string;
}

export interface FileItem {
  id: string;
  studyId: string;
  name: string;
  size: number;
  type: string;
  thumbnailUrl?: string;
  createdAt: string;
  modifiedAt: string;
  isDeleted: boolean;
}

export interface StorageStats {
  totalSpace: number;
  usedSpace: number;
  fileCount: number;
  folderCount: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export type ViewMode = 'grid' | 'list';

export interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}