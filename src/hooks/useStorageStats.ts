import { useState, useEffect } from 'react';
import api from '../utils/api';
import { StorageStats } from '../types';

export function useStorageStats() {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/files/stats');
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load storage stats');
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, refetch: fetchStats };
}