import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatients } from '@/hooks/usePatients';
import { useSelection } from '@/hooks/useSelection';
import { useContextMenu } from '@/hooks/useContextMenu';
import { FolderCard } from '@/components/FolderCard';
import { ContextMenu } from '@/components/ContextMenu';
import { EmptyState } from '@/components/EmptyState';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Patient } from '@/types';
import { FolderOpen, Download, Trash2, Move } from 'lucide-react';

export function PatientsPage() {
  const navigate = useNavigate();
  const { data: patients, isLoading } = usePatients();
  const { selectedIds, toggleSelection, clearSelection, isSelected } = useSelection<Patient>();
  const { x, y, isOpen, openContextMenu, closeContextMenu } = useContextMenu();
  const [contextPatient, setContextPatient] = useState<Patient | null>(null);

  const handleContextMenu = (e: React.MouseEvent, patient: Patient) => {
    setContextPatient(patient);
    openContextMenu(e);
  };

  const contextMenuItems = [
    {
      label: 'Open',
      icon: <FolderOpen className="w-4 h-4" />,
      onClick: () => {
        if (contextPatient) {
          navigate(`/patients/${contextPatient.id}`);
        }
      },
    },
    {
      label: 'Download',
      icon: <Download className="w-4 h-4" />,
      onClick: () => console.log('Download', contextPatient?.id),
    },
    {
      label: 'Move',
      icon: <Move className="w-4 h-4" />,
      onClick: () => console.log('Move', contextPatient?.id),
    },
    {
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      danger: true,
      onClick: () => console.log('Delete', contextPatient?.id),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
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
        <Breadcrumb items={[{ label: 'Patients' }]} onNavigate={navigate} />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
          Patients
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {patients?.length || 0} patients
        </p>
      </div>

      {/* Grid */}
      {patients && patients.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {patients.map((patient) => (
            <FolderCard
              key={patient.id}
              item={patient}
              itemCount={patient.studyCount}
              isSelected={isSelected(patient.id)}
              onClick={(e) => {
                const isMulti = e.ctrlKey || e.metaKey;
                toggleSelection(patient.id, isMulti);
              }}
              onDoubleClick={() => navigate(`/patients/${patient.id}`)}
              onContextMenu={(e) => handleContextMenu(e, patient)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No patients yet"
          description="Start by adding your first patient to organize their medical studies"
          action={{
            label: 'Add Patient',
            onClick: () => console.log('Add patient'),
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
