import { useState, useCallback } from 'react';
import { ExcalidrawFile, FileFolder, FileSystemItem } from '@/types/file';

export const useFileSystem = () => {
  const [files, setFiles] = useState<FileSystemItem[]>([
    {
      id: 'default-file',
      name: 'Desenho sem título',
      data: { elements: [], appState: { viewBackgroundColor: '#ffffff' } },
      lastModified: Date.now(),
    } as ExcalidrawFile,
  ]);
  
  const [activeFileId, setActiveFileId] = useState<string>('default-file');

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
      const remainingFiles = files.filter(f => f.id !== id && !('isFolder' in f));
      if (remainingFiles.length > 0) {
        setActiveFileId(remainingFiles[0].id);
      } else {
        // Criar um novo arquivo se não houver nenhum
        createFile('Novo desenho');
      }
    }
  }, [activeFileId, files, createFile]);

  const toggleFolder = useCallback((id: string) => {
    setFiles(prev => prev.map(item => 
      item.id === id && 'isFolder' in item 
        ? { ...item, isExpanded: !item.isExpanded } as FileFolder
        : item
    ));
  }, []);

  const getActiveFile = useCallback(() => {
    return files.find(f => f.id === activeFileId && !('isFolder' in f)) as ExcalidrawFile | undefined;
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