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
      // Constrain zoom to prevent canvas size errors
      const constrainedAppState = {
        ...appState,
        zoom: {
          value: Math.max(0.1, Math.min(30, appState?.zoom?.value || 1))
        },
        // Remove properties that shouldn't be saved
        isLoading: false,
        errorMessage: null,
      };

      const data = {
        elements,
        appState: constrainedAppState,
      };
      
      // Debounce save to avoid excessive updates
      const timeoutId = setTimeout(() => {
        onSave(file.id, data);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [file, onSave]);

  // Prepare initial data with zoom constraints
  const getInitialData = () => {
    if (!file?.data) return undefined;
    
    return {
      ...file.data,
      appState: {
        ...file.data.appState,
        zoom: {
          value: Math.max(0.1, Math.min(30, file.data.appState?.zoom?.value || 1))
        }
      }
    };
  };

  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 mx-auto mb-6 bg-primary/20 rounded-full flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-primary"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            Bem-vindo ao React Excalidraw Editor
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Selecione um arquivo no explorador lateral para começar a desenhar ou crie um novo arquivo para começar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background">
      <div className="h-full w-full">
        <Excalidraw
          initialData={getInitialData()}
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