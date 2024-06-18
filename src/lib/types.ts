// src/lib/types.ts
export interface FileItem {
    name: string;
    path: string;
    type: 'image' | 'video' | 'other';
    previewUrl?: string;
    fullUrl?: string;
  }
  
  export interface FolderItem {
    name: string;
    path: string;
    children?: FolderItem[];
  }