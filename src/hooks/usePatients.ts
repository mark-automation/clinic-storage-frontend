import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Patient } from '@/types';
import { mockApi } from '@/utils/mockApi';

export function usePatients() {
  return useQuery({
    queryKey: ['patients'],
    queryFn: mockApi.getPatients,
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: ['patients', id],
    queryFn: () => mockApi.getPatient(id),
    enabled: !!id,
  });
}