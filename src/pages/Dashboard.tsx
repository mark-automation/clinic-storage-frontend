import { format } from 'date-fns';
import { Card, CardContent, CardHeader } from '../components/Card';
import { useStorageStats } from '../hooks/useStorageStats';
import { HardDrive, Cloud, TrendingDown, FileText } from 'lucide-react';

export function Dashboard() {
  const { stats, loading } = useStorageStats();

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of your clinic storage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <HardDrive className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Hot Storage</p>
                <p className="text-2xl font-bold">{formatBytes(stats?.hotStorage.used || 0)}</p>
                <p className="text-xs text-gray-400">{stats?.hotStorage.files || 0} files</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Cloud className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Cold Storage</p>
                <p className="text-2xl font-bold">{formatBytes(stats?.coldStorage.used || 0)}</p>
                <p className="text-xs text-gray-400">{stats?.coldStorage.files || 0} files</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Monthly Cost</p>
                <p className="text-2xl font-bold">{formatCurrency(stats?.totalCost || 0)}</p>
                <p className="text-xs text-green-600">43% vs Google Drive</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Files</p>
                <p className="text-2xl font-bold">
                  {(stats?.hotStorage.files || 0) + (stats?.coldStorage.files || 0)}
                </p>
                <p className="text-xs text-gray-400">Across all tiers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Storage Distribution</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Hot Storage</span>
                <span className="text-sm text-gray-500">{formatBytes(stats?.hotStorage.used || 0)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${stats ? (stats.hotStorage.used / (stats.hotStorage.used + stats.coldStorage.used)) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Cold Storage</span>
                <span className="text-sm text-gray-500">{formatBytes(stats?.coldStorage.used || 0)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${stats ? (stats.coldStorage.used / (stats.hotStorage.used + stats.coldStorage.used)) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}