import { useState, useCallback } from 'react';
import api from '../utils/api';
import { FileItem, PaginatedResponse } from '../types';

interface UseFilesOptions {
  studyId?: number;
  page?: number;
  pageSize?: number;
}

export function useFiles(options: UseFilesOptions = {}) {
  const { studyId, page = 1, pageSize = 50 } = options;
  const [data, setData] = useState<PaginatedResponse<FileItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      let url = '/files';
      if (studyId) {
        url = `/files/study/${studyId}`;
      }
      
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());
      
      const response = await api.get(`${url}?${params}`);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load files');
    } finally {
      setLoading(false);
    }
  }, [studyId, page, pageSize]);

  const uploadFile = async (file: File, studyId: number) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('studyId', studyId.toString());

    const response = await api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const progress = progressEvent.total
          ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
          : 0;
        setUploadProgress(progress);
      }
    });
    
    setUploadProgress(0);
    return response.data;
  };

  const downloadFile = async (fileId: number, fileName: string) => {
    const response = await api.get(`/files/${fileId}/download`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const getPresignedUrl = async (fileId: number) => {
    const response = await api.get(`/files/${fileId}/url`);
    return response.data.url;
  };

  const deleteFile = async (fileId: number) => {
    await api.delete(`/files/${fileId}`);
    await fetchFiles();
  };

  return {
    data,
    loading,
    error,
    uploadProgress,
    fetchFiles,
    uploadFile,
    downloadFile,
    getPresignedUrl,
    deleteFile
  };
}