<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { FolderItem } from '$lib/types';

  export let folderTree: FolderItem[];

  let selectedFolder = '';

  const dispatch = createEventDispatcher();

  function handleFolderClick(folderPath: string) {
    selectedFolder = folderPath;
    dispatch('folderSelected', folderPath);
  }
</script>

<nav class="bg-gray-800 text-gray-200 p-4 md:w-64 w-full">
  <ul class="space-y-2">
    {#each folderTree as folder (folder.path)}
      <li class="pl-2" class:bg-gray-700={selectedFolder === folder.path}>
        <button
          class="w-full text-left py-2 px-4 rounded hover:bg-gray-700 focus:outline-none"
          on:click={() => handleFolderClick(folder.path)}
        >
          {folder.name}
        </button>
        {#if folder.children && folder.children.length > 0}
          <ul class="pl-4">
            {#each folder.children as subFolder (subFolder.path)}
              <li class="pl-2" class:bg-gray-700={selectedFolder === subFolder.path}>
                <button
                  class="w-full text-left py-2 px-4 rounded hover:bg-gray-700 focus:outline-none"
                  on:click={() => handleFolderClick(subFolder.path)}
                >
                  {subFolder.name}
                </button>
                {#if subFolder.children && subFolder.children.length > 0}
                  <ul class="pl-4">
                    {#each subFolder.children as subSubFolder (subSubFolder.path)}
                      <li class="pl-2" class:bg-gray-700={selectedFolder === subSubFolder.path}>
                        <button
                          class="w-full text-left py-2 px-4 rounded hover:bg-gray-700 focus:outline-none"
                          on:click={() => handleFolderClick(subSubFolder.path)}
                        >
                          {subSubFolder.name}
                        </button>
                      </li>
                    {/each}
                  </ul>
                {/if}
              </li>
            {/each}
          </ul>
        {/if}
      </li>
    {/each}
  </ul>
</nav>