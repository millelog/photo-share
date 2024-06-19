// src/lib/stores/selectedFilesStore.ts
import { writable } from 'svelte/store';

const localStorageKey = 'selectedFiles';

function createSelectedFilesStore() {
  let initial: string[] = [];
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(localStorageKey);
    initial = stored ? JSON.parse(stored) : [];
  }

  const { subscribe, set, update } = writable<string[]>(initial);

  return {
    subscribe,
    add: (filePath: string) => update(files => {
      if (!files.includes(filePath)) {
        const newFiles = [...files, filePath];
        if (typeof window !== 'undefined') {
          localStorage.setItem(localStorageKey, JSON.stringify(newFiles));
        }
        return newFiles;
      }
      return files;
    }),
    remove: (filePath: string) => update(files => {
      const newFiles = files.filter(path => path !== filePath);
      if (typeof window !== 'undefined') {
        localStorage.setItem(localStorageKey, JSON.stringify(newFiles));
      }
      return newFiles;
    }),
    set: (filePaths: string[]) => {
      const uniqueFilePaths = [...new Set(filePaths)];
      if (typeof window !== 'undefined') {
        localStorage.setItem(localStorageKey, JSON.stringify(uniqueFilePaths));
      }
      set(uniqueFilePaths);
    },
    clear: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(localStorageKey);
      }
      set([]);
    }
  };
}

export const selectedFilesStore = createSelectedFilesStore();