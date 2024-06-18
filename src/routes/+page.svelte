<script lang="ts">
  import { onMount } from 'svelte';
  import FolderNav from '$lib/components/FolderNav.svelte';
  import GridView from '$lib/components/GridView.svelte';
  import DownloadButton from '$lib/components/DownloadButton.svelte';
  import type { FolderItem, FileItem } from '$lib/types';

  let folderTree: FolderItem[] = [{ name: '', path: '' }];
  let selectedFiles: string[] = [];
  let selectedFolder = '';

  async function fetchFolderTree() {
    const response = await fetch('/api/folders');
    folderTree = await response.json();
  }

  function handleFolderSelected(event: CustomEvent<string>) {
    selectedFolder = event.detail;
  }

	function selectAll() {

	}

  function getFolderName(path: string) {
    return (path.split('\\').pop() ?? '').toUpperCase();
  }

  onMount(() => {
    fetchFolderTree();
  });
</script>

<div class="flex flex-col md:flex-row h-[100vh] bg-xgray text-white">
  <div class="md:w-64 bg-xgray md:h-full">
    <FolderNav {folderTree} on:folderSelected={handleFolderSelected} />
  </div>
  <div class="flex-1 overflow-y-scroll">
    <div class="sticky top-0 bg-xgray z-10 flex items-center justify-between">
      <h1 class="text-2xl font-bold p-4">{selectedFolder ? getFolderName(selectedFolder) : 'SELECT A FOLDER'}</h1>
      <div class="flex items-center">
        <button class="bg-xteal hover:bg-xdteal text-xgray font-bold py-5 px-4 h-full cursor-pointer focus:outline-none mr-2" on:click={selectAll}>
          Select All
        </button>
        <DownloadButton {selectedFolder} {selectedFiles} />
      </div>
    </div>
    <GridView {selectedFolder} bind:selectedFiles={selectedFiles} />
  </div>
</div>
