<script lang="ts">
    import { onMount } from 'svelte';
    import FolderNav from '$lib/components/FolderNav.svelte';
    import GridView from '$lib/components/GridView.svelte';
    import DownloadButton from '$lib/components/DownloadButton.svelte';
    import type { FolderItem } from '$lib/types';
  
    let folderTree: FolderItem[] = [{ name: '', path: '' }];
    let selectedFolder = '';
  
    async function fetchFolderTree() {
      const response = await fetch('/api/folders');
      folderTree = await response.json();
    }
  
    function handleFolderSelected(event: CustomEvent<string>) {
      selectedFolder = event.detail;
    }
  
    onMount(() => {
      fetchFolderTree();
    });
  </script>
  
  <div class="flex flex-col md:flex-row">
    <div class="md:w-64 bg-gray-100 p-4">
      <FolderNav {folderTree} on:folderSelected={handleFolderSelected} />
    </div>
    <div class="flex-1 p-4">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold">{selectedFolder || 'Select a folder'}</h1>
        <DownloadButton {selectedFolder} />
      </div>
      <GridView {selectedFolder} />
    </div>
  </div>