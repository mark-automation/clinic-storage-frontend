import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatient } from '@/hooks/usePatients';
import { useStudies } from '@/hooks/useStudies';
import { useSelection } from '@/hooks/useSelection';
import { useContextMenu } from '@/hooks/useContextMenu';
import { FolderCard } from '@/components/FolderCard';
import { ContextMenu } from '@/components/ContextMenu';
import { EmptyState } from '@/components/EmptyState';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Study } from '@/types';
import { FolderOpen, Download, Trash2, Move, ArrowLeft } from 'lucide-react';

export function StudiesPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { data: patient } = usePatient(patientId || '');
  const { data: studies, isLoading } = useStudies(patientId);
  const { selectedIds, toggleSelection, isSelected } = useSelection<Study>();
  const { x, y, isOpen, openContextMenu, closeContextMenu } = useContextMenu();
  const [contextStudy, setContextStudy] = useState<Study | null>(null);

  const handleContextMenu = (e: React.MouseEvent, study: Study) => {
    setContextStudy(study);
    openContextMenu(e);
  };

  const contextMenuItems = [
    {
      label: 'Open',
      icon: <FolderOpen className="w-4 h-4" />,
      onClick: () => {
        if (contextStudy) {
          navigate(`/patients/${patientId}/studies/${contextStudy.id}`);
        }
      },
    },
    {
      label: 'Download',
      icon: <Download className="w-4 h-4" />,
      onClick: () => console.log('Download study', contextStudy?.id),
    },
    {
      label: 'Move',
      icon: <Move className="w-4 h-4" />,
      onClick: () => console.log('Move study', contextStudy?.id),
    },
    {
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      danger: true,
      onClick: () => console.log('Delete study', contextStudy?.id),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: 'Patients', path: '/patients' },
            { label: patient?.name || 'Patient' },
          ]}
          onNavigate={navigate}
        />

        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={() => navigate('/patients')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {patient?.name || 'Patient'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {studies?.length || 0} studies
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      {studies && studies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {studies.map((study) => (
            <FolderCard
              key={study.id}
              item={study}
              itemCount={study.fileCount}
              isSelected={isSelected(study.id)}
              onClick={(e) => {
                const isMulti = e.ctrlKey || e.metaKey;
                toggleSelection(study.id, isMulti);
              }}
              onDoubleClick={() =>
                navigate(`/patients/${patientId}/studies/${study.id}`)
              }
              onContextMenu={(e) => handleContextMenu(e, study)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No studies yet"
          description={`Start by adding a study for ${patient?.name || 'this patient'}`}
          action={{
            label: 'Add Study',
            onClick: () => console.log('Add study'),
          }}
        />
      )}

      {/* Context menu */}
      <ContextMenu
        x={x}
        y={y}
        isOpen={isOpen}
        items={contextMenuItems}
        onClose={closeContextMenu}
      />
    </div>
  );
}
