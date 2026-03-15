import { useQuery } from '@tanstack/react-query';
import { mockApi } from '@/utils/mockApi';

export function useStudies(patientId?: string) {
  return useQuery({
    queryKey: ['studies', patientId],
    queryFn: () => mockApi.getStudies(patientId),
    enabled: patientId !== undefined,
  });
}

export function useStudy(id: string) {
  return useQuery({
    queryKey: ['studies', id],
    queryFn: () => mockApi.getStudy(id),
    enabled: !!id,
  });
}