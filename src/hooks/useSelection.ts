import { useState, useCallback } from 'react';

export function useSelection<T extends { id: string }>() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = useCallback((id: string, isMulti: boolean = false) => {
    setSelectedIds((prev: Set<string>) => {
      const newSet = isMulti ? new Set(prev) : new Set<string>();
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const selectAll = useCallback((items: T[]) => {
    setSelectedIds(new Set(items.map(item => item.id)));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds]);

  const selectedItems = useCallback((items: T[]) => {
    return items.filter(item => selectedIds.has(item.id));
  }, [selectedIds]);

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    selectedItems,
  };
}