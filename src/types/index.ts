export interface Patient {
  id: number;
  code: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Study {
  id: number;
  patientId: number;
  patientCode: string;
  studyType: string;
  description: string;
  studyDate: string;
  status: 'pending' | 'completed' | 'archived';
  fileCount: number;
  totalSize: number;
  createdAt: string;
  updatedAt: string;
}

export interface FileItem {
  id: number;
  studyId: number;
  fileName: string;
  originalName: string;
  contentType: string;
  size: number;
  storageTier: 'hot' | 'cold';
  storagePath: string;
  createdAt: string;
  updatedAt: string;
}

export interface StorageStats {
  hotStorage: {
    used: number;
    files: number;
  };
  coldStorage: {
    used: number;
    files: number;
  };
  totalCost: number;
  savingsVsGoogleDrive: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
}