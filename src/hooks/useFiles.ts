import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileItem } from '@/types';
import { mockApi } from '@/utils/mockApi';

export function useFiles(studyId?: string) {
  return useQuery({
    queryKey: ['files', studyId],
    queryFn: () => mockApi.getFiles(studyId),
    enabled: studyId !== undefined,
  });
}

export function useDeletedFiles() {
  return useQuery({
    queryKey: ['files', 'deleted'],
    queryFn: mockApi.getDeletedFiles,
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studyId, file, onProgress }: { studyId: string; file: File; onProgress?: (p: number) => void }) =>
      mockApi.uploadFile(studyId, file, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['storage'] });
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockApi.deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['storage'] });
    },
  });
}

export function useRestoreFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockApi.restoreFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['storage'] });
    },
  });
}