import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Patient, PaginatedResponse } from '../types';

interface UsePatientsOptions {
  page?: number;
  pageSize?: number;
  search?: string;
}

export function usePatients(options: UsePatientsOptions = {}) {
  const { page = 1, pageSize = 20, search = '' } = options;
  const [data, setData] = useState<PaginatedResponse<Patient> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, [page, pageSize, search]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());
      if (search) params.append('search', search);
      
      const response = await api.get(`/patients?${params}`);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const createPatient = async (patientData: Partial<Patient>) => {
    const response = await api.post('/patients', patientData);
    await fetchPatients();
    return response.data;
  };

  const updatePatient = async (id: number, patientData: Partial<Patient>) => {
    const response = await api.put(`/patients/${id}`, patientData);
    await fetchPatients();
    return response.data;
  };

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchPatients,
    createPatient,
    updatePatient
  };
}