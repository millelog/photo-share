//src/lib/stores/selectedFilesStore.ts
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
      const newFiles = [...files, filePath];
      if (typeof window !== 'undefined') {
        localStorage.setItem(localStorageKey, JSON.stringify(newFiles));
      }
      return newFiles;
    }),
    remove: (filePath: string) => update(files => {
      const newFiles = files.filter(path => path !== filePath);
      if (typeof window !== 'undefined') {
        localStorage.setItem(localStorageKey, JSON.stringify(newFiles));
      }
      return newFiles;
    }),
    set: (filePaths: string[]) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(localStorageKey, JSON.stringify(filePaths));
      }
      set(filePaths);
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
