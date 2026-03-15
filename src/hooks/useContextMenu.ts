import { useState, useCallback, useEffect } from 'react';

interface ContextMenuState {
  x: number;
  y: number;
  isOpen: boolean;
}

export function useContextMenu() {
  const [state, setState] = useState<ContextMenuState>({
    x: 0,
    y: 0,
    isOpen: false,
  });

  const openContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState({
      x: e.clientX,
      y: e.clientY,
      isOpen: true,
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  useEffect(() => {
    if (state.isOpen) {
      const handleClick = () => closeContextMenu();
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [state.isOpen, closeContextMenu]);

  return {
    ...state,
    openContextMenu,
    closeContextMenu,
  };
}