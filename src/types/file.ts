export interface ExcalidrawFile {
  id: string;
  name: string;
  data: any; // Excalidraw scene data
  lastModified: number;
  parentId?: string; // For folder structure
}

export interface FileFolder {
  id: string;
  name: string;
  isFolder: true;
  parentId?: string;
  children: (ExcalidrawFile | FileFolder)[];
  isExpanded?: boolean;
}

export type FileSystemItem = ExcalidrawFile | FileFolder;

export interface FileContextMenuProps {
  x: number;
  y: number;
  item: FileSystemItem;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}