import { useNavigate } from 'react-router-dom';
import { Folder, FileText, Clock, TrendingUp } from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useStorageStats } from '@/hooks/useStorage';
import { EmptyState } from '@/components/EmptyState';
import { formatFileSize, formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: patients, isLoading: patientsLoading } = usePatients();
  const { data: storageStats, isLoading: storageLoading } = useStorageStats();

  const recentPatients = patients?.slice(0, 5) || [];

  // Mock storage breakdown data
  const storageData = storageStats
    ? [
        { name: 'Images', value: storageStats.usedSpace * 0.6 },
        { name: 'Documents', value: storageStats.usedSpace * 0.25 },
        { name: 'Videos', value: storageStats.usedSpace * 0.1 },
        { name: 'Other', value: storageStats.usedSpace * 0.05 },
      ]
    : [];

  const stats = [
    {
      label: 'Total Patients',
      value: patients?.length || 0,
      icon: Folder,
      color: 'bg-blue-500',
      trend: '+12%',
    },
    {
      label: 'Total Files',
      value: storageStats?.fileCount || 0,
      icon: FileText,
      color: 'bg-green-500',
      trend: '+5%',
    },
    {
      label: 'Storage Used',
      value: storageStats ? formatFileSize(storageStats.usedSpace) : '0 B',
      icon: TrendingUp,
      color: 'bg-purple-500',
      trend: '78%',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600 dark:text-green-400">{stat.trend}</span>
                    <span className="text-xs text-gray-400">vs last month</span>
                  </div>
                </div>
                <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', stat.color)}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Storage chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Storage Breakdown
          </h3>
          {storageData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={storageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {storageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatFileSize(value)}
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">No storage data available</p>
            </div>
          )}
        </div>

        {/* Recent patients */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Patients
            </h3>
            <button
              onClick={() => navigate('/patients')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all
            </button>
          </div>

          {recentPatients.length > 0 ? (
            <div className="space-y-3">
              {recentPatients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => navigate(`/patients/${patient.id}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                      {patient.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {patient.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {patient.studyCount} studies
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {formatDate(patient.lastModified)}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No patients yet"
              description="Start by adding your first patient"
              action={{
                label: 'Add Patient',
                onClick: () => navigate('/patients'),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
