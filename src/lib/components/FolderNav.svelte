<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { FolderItem } from '$lib/types';

  export let folderTree: FolderItem[];

  let selectedFolder = '';
  let isOpen = false;

  const dispatch = createEventDispatcher();

  function handleFolderClick(folderPath: string) {
    selectedFolder = folderPath;
    dispatch('folderSelected', folderPath);
    isOpen = false;
  }

  function toggleMenu() {
    isOpen = !isOpen;
  }
</script>

<nav class="bg-xdgray text-white md:min-h-[100vh]">
  <div class="flex justify-between items-center p-2 md:hidden">
    <h2 class="text-lg font-bold">Folders</h2>
    <button on:click={toggleMenu} class="focus:outline-none">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>
  <ul class="space-y-2 overflow-y-auto md:block" class:hidden={!isOpen}>
    {#each folderTree as folder (folder.path)}
      <li class="" class:bg-teal-600={selectedFolder === folder.path}>
        <button
          class="w-full text-left py-2 px-4 hover:bg-[#2AC2C6] focus:outline-none"
          on:click={() => handleFolderClick(folder.path)}
        >
          {folder.name}
        </button>
        {#if folder.children && folder.children.length > 0}
          <ul class="pl-4">
            {#each folder.children as subFolder (subFolder.path)}
              <li class="" class:bg-teal-600={selectedFolder === subFolder.path}>
                <button
                  class="w-full text-left py-2 px-4 hover:bg-[#2AC2C6] focus:outline-none"
                  on:click={() => handleFolderClick(subFolder.path)}
                >
                  {subFolder.name}
                </button>
                {#if subFolder.children && subFolder.children.length > 0}
                  <ul class="pl-4">
                    {#each subFolder.children as subSubFolder (subSubFolder.path)}
                      <li class="pl-2" class:bg-teal-600={selectedFolder === subSubFolder.path}>
                        <button
                          class="w-full text-left py-2 px-4 hover:bg-teal-600 focus:outline-none"
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