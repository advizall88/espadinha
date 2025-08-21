import { useState, useCallback } from 'react';
import { ExcalidrawFile, FileFolder, FileSystemItem } from '@/types/file';

export const useFileSystem = () => {
  const [files, setFiles] = useState<FileSystemItem[]>([
    {
      id: 'projeto-desenhos',
      name: 'Projeto de Desenhos',
      isFolder: true,
      children: [
        {
          id: 'ideias-iniciais',
          name: '1. Ideias Iniciais',
          data: { elements: [], appState: { viewBackgroundColor: '#ffffff' } },
          lastModified: Date.now() - 86400000,
          parentId: 'projeto-desenhos',
        } as ExcalidrawFile,
        {
          id: 'wireframes',
          name: '2. Wireframes',
          data: { elements: [], appState: { viewBackgroundColor: '#ffffff' } },
          lastModified: Date.now() - 43200000,
          parentId: 'projeto-desenhos',
        } as ExcalidrawFile,
        {
          id: 'design-final',
          name: '3. Design Final',
          data: { elements: [], appState: { viewBackgroundColor: '#ffffff' } },
          lastModified: Date.now() - 21600000,
          parentId: 'projeto-desenhos',
        } as ExcalidrawFile,
      ],
      isExpanded: true,
    } as FileFolder,
    {
      id: 'rascunhos',
      name: 'Rascunhos',
      isFolder: true,
      children: [
        {
          id: 'rascunho-1',
          name: 'Rascunho 2025-01-31',
          data: { elements: [], appState: { viewBackgroundColor: '#ffffff' } },
          lastModified: Date.now(),
          parentId: 'rascunhos',
        } as ExcalidrawFile,
      ],
      isExpanded: false,
    } as FileFolder,
  ]);
  
  const [activeFileId, setActiveFileId] = useState<string>('');

  const createFile = useCallback((name: string, parentId?: string) => {
    const newFile: ExcalidrawFile = {
      id: `file-${Date.now()}`,
      name,
      data: { elements: [], appState: { viewBackgroundColor: '#ffffff' } },
      lastModified: Date.now(),
      parentId,
    };

    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
    return newFile.id;
  }, []);

  const createFolder = useCallback((name: string, parentId?: string) => {
    const newFolder: FileFolder = {
      id: `folder-${Date.now()}`,
      name,
      isFolder: true,
      parentId,
      children: [],
      isExpanded: true,
    };

    setFiles(prev => [...prev, newFolder]);
    return newFolder.id;
  }, []);

  const updateFile = useCallback((id: string, data: any) => {
    setFiles(prev => prev.map(file => 
      file.id === id && !('isFolder' in file) 
        ? { ...file, data, lastModified: Date.now() } as ExcalidrawFile
        : file
    ));
  }, []);

  const renameItem = useCallback((id: string, newName: string) => {
    setFiles(prev => prev.map(item => 
      item.id === id ? { ...item, name: newName } : item
    ));
  }, []);

  const deleteItem = useCallback((id: string) => {
    setFiles(prev => prev.filter(item => item.id !== id));
    if (activeFileId === id) {
      // Buscar o primeiro arquivo disponível
      const findFirstFile = (items: FileSystemItem[]): string | null => {
        for (const item of items) {
          if (!('isFolder' in item)) {
            return item.id;
          } else if (item.children.length > 0) {
            const childFile = findFirstFile(item.children);
            if (childFile) return childFile;
          }
        }
        return null;
      };
      
      const remainingFiles = files.filter(f => f.id !== id);
      const firstFileId = findFirstFile(remainingFiles);
      
      if (firstFileId) {
        setActiveFileId(firstFileId);
      } else {
        setActiveFileId('');
      }
    }
  }, [activeFileId, files]);

  const toggleFolder = useCallback((id: string) => {
    setFiles(prev => prev.map(item => 
      item.id === id && 'isFolder' in item 
        ? { ...item, isExpanded: !item.isExpanded } as FileFolder
        : item
    ));
  }, []);

  const getActiveFile = useCallback(() => {
    const findFileById = (items: FileSystemItem[], id: string): ExcalidrawFile | undefined => {
      for (const item of items) {
        if (item.id === id && !('isFolder' in item)) {
          return item as ExcalidrawFile;
        } else if ('isFolder' in item && item.children.length > 0) {
          const found = findFileById(item.children, id);
          if (found) return found;
        }
      }
      return undefined;
    };
    
    return findFileById(files, activeFileId);
  }, [files, activeFileId]);

  return {
    files,
    activeFileId,
    setActiveFileId,
    createFile,
    createFolder,
    updateFile,
    renameItem,
    deleteItem,
    toggleFolder,
    getActiveFile,
  };
};