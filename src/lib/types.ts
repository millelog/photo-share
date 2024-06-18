export interface FileTreeItem {
    name: string;
    path: string;
    type: 'folder' | 'image' | 'video' | 'other';
    previewUrl?: string;
    children?: FileTreeItem[];
  }