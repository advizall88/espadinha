import React, { useEffect, useCallback } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import { ExcalidrawFile } from '@/types/file';

interface ExcalidrawCanvasProps {
  file: ExcalidrawFile | undefined;
  onSave: (id: string, data: any) => void;
}

export const ExcalidrawCanvas: React.FC<ExcalidrawCanvasProps> = ({ file, onSave }) => {
  const handleChange = useCallback((elements: any, appState: any) => {
    if (file) {
      const data = {
        elements,
        appState: {
          ...appState,
          // Remove properties that shouldn't be saved
          isLoading: false,
          errorMessage: null,
        },
      };
      
      // Debounce save to avoid excessive updates
      const timeoutId = setTimeout(() => {
        onSave(file.id, data);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [file, onSave]);

  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background text-muted-foreground">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Nenhum arquivo selecionado</h3>
          <p className="text-sm">Selecione um arquivo na barra lateral ou crie um novo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background">
      <div className="h-full w-full">
        <Excalidraw
          initialData={file.data}
          onChange={handleChange}
          theme="dark"
          UIOptions={{
            canvasActions: {
              loadScene: false,
              saveToActiveFile: false,
            },
          }}
        />
      </div>
    </div>
  );
};