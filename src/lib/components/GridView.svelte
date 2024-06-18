<script lang="ts">
  import { onMount } from 'svelte';
  import type { FileItem } from '$lib/types';

  export let selectedFolder = '';
  let files: FileItem[] = [];
  let selectedFile: FileItem | null = null;
  let selectedFiles: string[] = [];

  async function fetchFiles() {
    const response = await fetch(`/api/files?path=${encodeURIComponent(selectedFolder)}`);
    files = await response.json();
  }

  function openPreview(file: FileItem) {
    selectedFile = file;
  }

  function closePreview() {
    selectedFile = null;
  }

  function toggleFileSelection(filePath: string) {
    if (selectedFiles.includes(filePath)) {
      selectedFiles = selectedFiles.filter((path) => path !== filePath);
    } else {
      selectedFiles = [...selectedFiles, filePath];
    }
  }

  $: {
    if (selectedFolder) {
      fetchFiles();
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h2 class="text-2xl font-bold mb-4 text-[#2AC2C6]">{selectedFolder}</h2>
  <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-1">
    {#each files as file (file.path)}
      <div
        class="bg-gray-800 relative cursor-pointer group"
        on:click={() => openPreview(file)}
      >
        <div class="absolute top-0 left-0 p-2">
          <input
            type="checkbox"
            class="form-checkbox h-5 w-5 text-[#2AC2C6] rounded-full"
            checked={selectedFiles.includes(file.path)}
            on:change={() => toggleFileSelection(file.path)
            }
          />
        </div>
        {#if file.type === 'image'}
          <img
            src={file.previewUrl}
            alt={file.name}
            class="w-full h-36 object-cover"
          />
        {:else if file.type === 'video'}
          <video
            src={file.fullUrl}
            class="w-full h-36 object-cover"
          />
        {/if}
        <div class="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <p class="text-sm truncate text-white">{file.name}</p>
        </div>
      </div>
    {/each}
  </div>
</div>

{#if selectedFile}
  <div
    class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center"
    on:click={closePreview}
  >
    <div class="bg-gray-900 rounded-lg p-4 max-w-4xl mx-auto">
      {#if selectedFile.type === 'image'}
        <img
          src={selectedFile.fullUrl}
          alt={selectedFile.name}
          class="w-full h-auto rounded-md"
        />
      {:else if selectedFile.type === 'video'}
        <video
          src={selectedFile.fullUrl}
          class="w-full h-auto rounded-md"
          controls
        />
      {/if}
    </div>
  </div>
{/if}