import { Card, CardContent, CardHeader } from '../components/Card';
import { useStorageStats } from '../hooks/useStorageStats';
import { HardDrive, Cloud, TrendingDown, DollarSign, Info } from 'lucide-react';

export function Storage() {
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

  const totalUsed = (stats?.hotStorage.used || 0) + (stats?.coldStorage.used || 0);
  const hotPercentage = totalUsed > 0 ? (stats?.hotStorage.used || 0) / totalUsed * 100 : 0;
  const coldPercentage = totalUsed > 0 ? (stats?.coldStorage.used || 0) / totalUsed * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Storage Management</h1>
        <p className="text-gray-500">Monitor and manage your storage tiers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <HardDrive className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold">Hot Storage (Wasabi)</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Used Space</span>
              <span className="text-2xl font-bold">{formatBytes(stats?.hotStorage.used || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Files</span>
              <span className="font-medium">{stats?.hotStorage.files.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cost per GB</span>
              <span className="font-medium">₱0.42</span>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Fast Access</p>
                  <p>Files in hot storage are immediately accessible. Use for recent studies and frequently accessed files.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Cloud className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold">Cold Storage (S3 Glacier)</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Used Space</span>
              <span className="text-2xl font-bold">{formatBytes(stats?.coldStorage.used || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Files</span>
              <span className="font-medium">{stats?.coldStorage.files.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cost per GB</span>
              <span className="font-medium">₱0.12</span>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-purple-600 mt-0.5" />
                <div className="text-sm text-purple-800">
                  <p className="font-medium">Archive Storage</p>
                  <p>Files older than 90 days are automatically moved here. Retrieval takes 12-48 hours.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold">Cost Analysis</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Current Monthly Cost</p>
              <p className="text-3xl font-bold text-primary-600">{formatCurrency(stats?.totalCost || 0)}</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Google Drive Equivalent</p>
              <p className="text-3xl font-bold text-gray-700">
                {formatCurrency((totalUsed / (1024 * 1024 * 1024)) * 0.30)}
              </p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Monthly Savings</p>
              <div className="flex items-center justify-center gap-2">
                <TrendingDown className="w-6 h-6 text-green-600" />
                <p className="text-3xl font-bold text-green-600">43%</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-4">Storage Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Hot Storage</span>
                  <span className="text-sm text-gray-500">{hotPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${hotPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Cold Storage</span>
                  <span className="text-sm text-gray-500">{coldPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-purple-600 h-3 rounded-full transition-all"
                    style={{ width: `${coldPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}