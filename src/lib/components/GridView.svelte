<!-- src/components/GridView.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import type { FileTreeItem } from '$lib/types';
  
    export let selectedFolder = '';
    let files: FileTreeItem[] = [];
    let selectedFile: FileTreeItem | null = null;
  
    async function fetchFiles() {
      const response = await fetch(`/api/data?folder=${selectedFolder}`);
      files = await response.json();
    }
  
    function openPreview(file: FileTreeItem) {
      selectedFile = file;
    }
  
    function closePreview() {
      selectedFile = null;
    }
  
    $: {
      if (selectedFolder) {
        fetchFiles();
      }
    }
  </script>
  
  <div class="container mx-auto px-4 py-8">
    <h2 class="text-2xl font-bold mb-4">{selectedFolder}</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {#each files as file (file.path)}
        <div
          class="bg-white rounded-lg shadow-md p-4 cursor-pointer"
          on:click={() => openPreview(file)}
        >
          {#if file.type === 'image'}
            <img
              src={file.previewUrl}
              alt={file.name}
              class="w-full h-32 object-cover rounded-md mb-2"
            />
          {:else if file.type === 'video'}
            <video
              src={file.previewUrl}
              class="w-full h-32 object-cover rounded-md mb-2"
            />
          {:else}
            <div class="w-full h-32 flex items-center justify-center bg-gray-100 rounded-md mb-2">
              <span class="text-gray-500">{file.name}</span>
            </div>
          {/if}
          <p class="text-sm truncate">{file.name}</p>
        </div>
      {/each}
    </div>
  </div>
  
  {#if selectedFile}
    <div
      class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center"
      on:click={closePreview}
    >
      <div class="bg-white rounded-lg p-4 max-w-4xl mx-auto">
        {#if selectedFile.type === 'image'}
          <img
            src={selectedFile.previewUrl}
            alt={selectedFile.name}
            class="w-full h-auto rounded-md"
          />
        {:else if selectedFile.type === 'video'}
          <video
            src={selectedFile.previewUrl}
            class="w-full h-auto rounded-md"
            controls
          />
        {/if}
      </div>
    </div>
  {/if}