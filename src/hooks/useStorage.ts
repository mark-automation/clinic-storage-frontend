import { useQuery } from '@tanstack/react-query';
import { mockApi } from '@/utils/mockApi';

export function useStorageStats() {
  return useQuery({
    queryKey: ['storage'],
    queryFn: mockApi.getStorageStats,
  });
}