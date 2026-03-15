import { Patient, Study, FileItem, StorageStats, User } from '@/types';

// Mock data
const mockPatients: Patient[] = [
  { id: 'p1', name: 'John Smith', email: 'john@example.com', dateOfBirth: '1985-03-15', studyCount: 3, lastModified: '2024-01-15T10:30:00Z' },
  { id: 'p2', name: 'Sarah Johnson', email: 'sarah@example.com', dateOfBirth: '1990-07-22', studyCount: 2, lastModified: '2024-01-14T14:20:00Z' },
  { id: 'p3', name: 'Michael Brown', email: 'mike@example.com', dateOfBirth: '1978-11-08', studyCount: 5, lastModified: '2024-01-13T09:15:00Z' },
  { id: 'p4', name: 'Emily Davis', email: 'emily@example.com', dateOfBirth: '1992-05-30', studyCount: 1, lastModified: '2024-01-12T16:45:00Z' },
  { id: 'p5', name: 'Robert Wilson', email: 'rob@example.com', dateOfBirth: '1983-09-18', studyCount: 4, lastModified: '2024-01-11T11:00:00Z' },
];

const mockStudies: Study[] = [
  { id: 's1', patientId: 'p1', name: 'MRI Brain Scan', description: 'Annual checkup MRI', fileCount: 12, lastModified: '2024-01-15T10:30:00Z' },
  { id: 's2', patientId: 'p1', name: 'Blood Work 2024', description: 'Complete blood panel', fileCount: 3, lastModified: '2024-01-10T08:00:00Z' },
  { id: 's3', patientId: 'p1', name: 'X-Ray Chest', description: 'Chest X-ray results', fileCount: 5, lastModified: '2024-01-05T14:30:00Z' },
  { id: 's4', patientId: 'p2', name: 'CT Scan Abdomen', description: 'Abdominal CT with contrast', fileCount: 8, lastModified: '2024-01-14T14:20:00Z' },
  { id: 's5', patientId: 'p2', name: 'Ultrasound Liver', description: 'Liver ultrasound screening', fileCount: 4, lastModified: '2024-01-08T10:00:00Z' },
  { id: 's6', patientId: 'p3', name: 'Cardiac MRI', description: 'Heart MRI for valve assessment', fileCount: 15, lastModified: '2024-01-13T09:15:00Z' },
];

const mockFiles: FileItem[] = [
  { id: 'f1', studyId: 's1', name: 'axial_t1.jpg', size: 2048576, type: 'image/jpeg', createdAt: '2024-01-15T10:00:00Z', modifiedAt: '2024-01-15T10:30:00Z', isDeleted: false },
  { id: 'f2', studyId: 's1', name: 'sagittal_t2.jpg', size: 1892000, type: 'image/jpeg', createdAt: '2024-01-15T10:05:00Z', modifiedAt: '2024-01-15T10:30:00Z', isDeleted: false },
  { id: 'f3', studyId: 's1', name: 'coronal_flair.jpg', size: 2150000, type: 'image/jpeg', createdAt: '2024-01-15T10:10:00Z', modifiedAt: '2024-01-15T10:30:00Z', isDeleted: false },
  { id: 'f4', studyId: 's1', name: 'report.pdf', size: 450000, type: 'application/pdf', createdAt: '2024-01-15T10:20:00Z', modifiedAt: '2024-01-15T10:30:00Z', isDeleted: false },
  { id: 'f5', studyId: 's2', name: 'cbc_results.pdf', size: 120000, type: 'application/pdf', createdAt: '2024-01-10T08:00:00Z', modifiedAt: '2024-01-10T08:00:00Z', isDeleted: false },
  { id: 'f6', studyId: 's2', name: 'lipid_panel.xlsx', size: 25000, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', createdAt: '2024-01-10T08:00:00Z', modifiedAt: '2024-01-10T08:00:00Z', isDeleted: false },
];

const mockUser: User = {
  id: 'u1',
  email: 'doctor@clinic.com',
  name: 'Dr. Jane Doe',
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Auth
  login: async (email: string, password: string): Promise<User> => {
    await delay(500);
    if (email === 'doctor@clinic.com' && password === 'password') {
      return mockUser;
    }
    throw new Error('Invalid credentials');
  },

  // Patients
  getPatients: async (): Promise<Patient[]> => {
    await delay(300);
    return mockPatients.filter(p => !p.id.startsWith('deleted'));
  },

  getPatient: async (id: string): Promise<Patient | undefined> => {
    await delay(200);
    return mockPatients.find(p => p.id === id);
  },

  // Studies
  getStudies: async (patientId?: string): Promise<Study[]> => {
    await delay(300);
    if (patientId) {
      return mockStudies.filter(s => s.patientId === patientId);
    }
    return mockStudies;
  },

  getStudy: async (id: string): Promise<Study | undefined> => {
    await delay(200);
    return mockStudies.find(s => s.id === id);
  },

  // Files
  getFiles: async (studyId?: string): Promise<FileItem[]> => {
    await delay(300);
    let files = mockFiles.filter(f => !f.isDeleted);
    if (studyId) {
      files = files.filter(f => f.studyId === studyId);
    }
    return files;
  },

  getDeletedFiles: async (): Promise<FileItem[]> => {
    await delay(300);
    return mockFiles.filter(f => f.isDeleted);
  },

  uploadFile: async (studyId: string, file: File, onProgress?: (progress: number) => void): Promise<FileItem> => {
    await delay(1000);
    if (onProgress) {
      for (let i = 0; i <= 100; i += 20) {
        onProgress(i);
        await delay(100);
      }
    }
    const newFile: FileItem = {
      id: `f${Date.now()}`,
      studyId,
      name: file.name,
      size: file.size,
      type: file.type,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      isDeleted: false,
    };
    mockFiles.push(newFile);
    return newFile;
  },

  deleteFile: async (id: string): Promise<void> => {
    await delay(200);
    const file = mockFiles.find(f => f.id === id);
    if (file) {
      file.isDeleted = true;
    }
  },

  restoreFile: async (id: string): Promise<void> => {
    await delay(200);
    const file = mockFiles.find(f => f.id === id);
    if (file) {
      file.isDeleted = false;
    }
  },

  downloadFile: async (id: string): Promise<Blob> => {
    await delay(500);
    return new Blob(['Mock file content'], { type: 'application/octet-stream' });
  },

  // Storage stats
  getStorageStats: async (): Promise<StorageStats> => {
    await delay(200);
    const usedSpace = mockFiles.reduce((acc, f) => acc + f.size, 0);
    return {
      totalSpace: 10737418240, // 10 GB
      usedSpace,
      fileCount: mockFiles.length,
      folderCount: mockStudies.length + mockPatients.length,
    };
  },
};