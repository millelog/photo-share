<script lang="ts">
  import "../app.css";
  import { onMount } from 'svelte';
  import FolderNav from '$lib/components/FolderNav.svelte';
  import GridView from '$lib/components/GridView.svelte';
  import DownloadButton from '$lib/components/DownloadButton.svelte';
  import type { FolderItem } from '$lib/types';
  import { selectedFolder } from '$lib/stores/selectedFolderStore';


  let folderTree: FolderItem[] = [{ name: '', path: '' }];
  let selectedFiles: string[] = [];
  let currentSelectedFolder = '';

  selectedFolder.subscribe(value => {
    currentSelectedFolder = value;
  });

  async function fetchFolderTree() {
    const response = await fetch('/api/folders');
    folderTree = await response.json();
  }

  function handleFolderSelected(event: CustomEvent<string>) {
    selectedFolder.set(event.detail);
  }

  function selectAll() {
    const checkboxes = document.querySelectorAll('.image-checkbox');
    checkboxes.forEach((checkbox) => {
      (checkbox as HTMLInputElement).checked = true;

      // Create a new event
      const event = new Event('change', {
        bubbles: true,
        cancelable: true,
      });

      // Dispatch the event
      checkbox.dispatchEvent(event);
    });
  }

  function getFolderName(filePath: string) {
    const separator = process.env.NODE_ENV === 'production' ? '/' : '\\';
    return (filePath.split(separator).pop() ?? '').toUpperCase();
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
    <div class="sticky top-0 bg-xgray z-20 flex items-center justify-between">
      <h1 class="text-base md:text-2xl font-bold p-4 text-nowrap">
        {currentSelectedFolder ? getFolderName(currentSelectedFolder) : 'SELECT A FOLDER'}
      </h1>
      <div class="flex items-center">
        <button
          class="bg-xteal hover:bg-xdteal text-xgray font-bold py-4 md:py-5 px-2 md:px-4 h-full cursor-pointer focus:outline-none mr-1 text-nowrap"
          on:click={selectAll}
        >
          Select All
        </button>
        <DownloadButton {currentSelectedFolder} {selectedFiles} />
      </div>
    </div>
    <GridView {currentSelectedFolder} bind:selectedFiles />
  </div>
</div>
<slot/>
