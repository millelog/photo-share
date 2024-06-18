<!-- src/components/FolderNav.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import type { FileTreeItem } from '$lib/types';

  export let fileTree: FileTreeItem[] = [];

  let selectedFolder = '';
  let expandedFolders: string[] = [];

  const dispatch = createEventDispatcher();

  function handleFolderClick(folderPath: string) {
    selectedFolder = folderPath;
    dispatch('folderSelected', folderPath);
  }

  function toggleFolder(folderPath: string) {
    if (expandedFolders.includes(folderPath)) {
      expandedFolders = expandedFolders.filter(path => path !== folderPath);
    } else {
      expandedFolders = [...expandedFolders, folderPath];
    }
  }

  function isExpanded(folderPath: string) {
    return expandedFolders.includes(folderPath);
  }

  onMount(() => {
    if (fileTree.length > 0) {
      selectedFolder = fileTree[0].path;
      dispatch('folderSelected', selectedFolder);
    }
  });
</script>

<nav class="bg-gray-800 text-gray-200 p-4 md:w-64 w-full">
  <ul class="space-y-2">
    {#each fileTree as item (item.path)}
      {#if item.type === 'folder'}
        <li class="pl-2" class:bg-gray-700={selectedFolder === item.path}>
          <button
            class="w-full text-left py-2 px-4 rounded hover:bg-gray-700 focus:outline-none"
            on:click={() => handleFolderClick(item.path)}
          >
            {#if item.children && item.children.length > 0}
              <span
                class="inline-block mr-2 cursor-pointer text-teal-400"
                on:click|stopPropagation={() => toggleFolder(item.path)}
              >
                {#if isExpanded(item.path)}
                  ▼
                {:else}
                  ▶
                {/if}
              </span>
            {/if}
            {item.name}
          </button>
          {#if item.children && isExpanded(item.path)}
            <ul class="pl-4">
              <svelte:self fileTree={item.children} />
            </ul>
          {/if}
        </li>
      {/if}
    {/each}
  </ul>
</nav>