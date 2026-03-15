import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '../components/Card';
import { useFiles } from '../hooks/useFiles';
import { 
  Upload, 
  Download, 
  Trash2, 
  Link as LinkIcon, 
  Folder,
  File,
  Image,
  FileText,
  ChevronLeft,
  ChevronRight,
  Cloud,
  HardDrive
} from 'lucide-react';
import { format } from 'date-fns';
import { FileItem } from '../types';

export function Files() {
  const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set());
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { data, loading, uploadProgress, uploadFile, downloadFile, deleteFile, fetchFiles } = useFiles({ page: 1, pageSize: 50 });

  const handleFileSelect = (fileId: number) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFiles) return;

    for (let i = 0; i < uploadFiles.length; i++) {
      await uploadFile(uploadFiles[i], 1); // Using studyId 1 for now
    }
    
    setUploadFiles(null);
    setShowUploadModal(false);
    await fetchFiles();
  };

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (contentType.includes('pdf')) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Files</h1>
          <p className="text-gray-500">Manage medical files and studies</p>
        </div>
        <div className="flex gap-3">
          {selectedFiles.size > 0 && (
            <>
              <button
                onClick={() => {
                  selectedFiles.forEach(id => downloadFile(id, `file-${id}`));
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download ({selectedFiles.size})
              </button>
              <button
                onClick={async () => {
                  for (const id of selectedFiles) {
                    await deleteFile(id);
                  }
                  setSelectedFiles(new Set());
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Files
          </button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">All Files</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 w-12">
                      <input
                        type="checkbox"
                        checked={data?.items.length > 0 && selectedFiles.size === data.items.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFiles(new Set(data?.items.map(f => f.id)));
                          } else {
                            setSelectedFiles(new Set());
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data?.items.map((file: FileItem) => (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedFiles.has(file.id)}
                          onChange={() => handleFileSelect(file.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="text-gray-400">{getFileIcon(file.contentType)}</div>
                          <div>
                            <div className="font-medium text-gray-900">{file.originalName}</div>
                            <div className="text-sm text-gray-500">{file.contentType}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatBytes(file.size)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          file.storageTier === 'hot' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {file.storageTier === 'hot' ? <HardDrive className="w-3 h-3" /> : <Cloud className="w-3 h-3" />}
                          {file.storageTier === 'hot' ? 'Hot' : 'Cold'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {format(new Date(file.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => downloadFile(file.id, file.originalName)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Copy Link"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteFile(file.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {data?.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Showing {data.items.length} of {data.totalCount} files
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">Upload Files</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
                <input
                  type="file"
                  multiple
                  onChange={(e) => setUploadFiles(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Click to select files or drag and drop</p>
                  <p className="text-sm text-gray-400 mt-2">Maximum file size: 500MB</p>
                </label>
                
                {uploadFiles && (
                  <div className="mt-4 text-left">
                    <p className="text-sm font-medium text-gray-700">Selected files:</p>
                    <ul className="mt-2 space-y-1">
                      {Array.from(uploadFiles).map((file, idx) => (
                        <li key={idx} className="text-sm text-gray-600">{file.name} ({formatBytes(file.size)})</li>
                      ))}
                    </ul>
                    
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full transition-all"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Uploading... {uploadProgress}%</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadFiles(null);
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!uploadFiles || uploadProgress > 0}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}