<!--src/lib/components/FolderNav.svelte-->
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

<nav class="bg-xdgray text-white md:min-h-[100vh] md:h-full flex flex-col">
  <div class="flex justify-between items-center p-2 md:hidden">
    <h2 class="text-lg font-bold">Folders</h2>
    <button on:click={toggleMenu} class="focus:outline-none">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>
  <ul class="space-y-2 overflow-y-auto flex-grow md:block pb-4 md:pb-4" class:hidden={!isOpen}>
    {#each folderTree as folder (folder.path)}
      <li class="relative pl-4 before:content-[''] before:absolute before:h-full before:w-px before:bg-teal-600 before:left-0 ">
        <button
          class="w-full text-left py-2 px-4 hover:bg-[#2AC2C6] focus:outline-none {selectedFolder === folder.path ? 'bg-teal-600' : ''}"
          on:click={() => handleFolderClick(folder.path)}
        >
          {folder.name}
        </button>
        {#if folder.children && folder.children.length > 0}
          <ul class="pl-4 ml-2 before:content-[''] before:absolute before:h-full before:w-px before:bg-teal-600 before:left-[-8px]">
            {#each folder.children as subFolder (subFolder.path)}
              <li class="relative pl-4 before:content-[''] before:absolute before:h-full before:w-px before:bg-teal-600 before:left-0 after:content-[''] after:absolute after:h-px after:w-4 after:bg-teal-600 after:left-[-8px] after:top-[1.25rem]">
                <button
                  class="w-full text-left py-2 px-4 hover:bg-[#2AC2C6] focus:outline-none {selectedFolder === subFolder.path ? 'bg-teal-600' : ''}"
                  on:click={() => handleFolderClick(subFolder.path)}
                >
                  {subFolder.name}
                </button>
                {#if subFolder.children && subFolder.children.length > 0}
                  <ul class="pl-4 ml-2 before:content-[''] before:absolute before:h-full before:w-px before:bg-teal-600 before:left-[-8px]">
                    {#each subFolder.children as subSubFolder (subSubFolder.path)}
                      <li class="relative pl-4 before:content-[''] before:absolute before:h-full before:w-px before:bg-teal-600 before:left-0 after:content-[''] after:absolute after:h-px after:w-4 after:bg-teal-600 after:left-[-8px] after:top-[1.25rem]">
                        <button
                          class="w-full text-left py-2 px-4 hover:bg-teal-600 focus:outline-none {selectedFolder === subSubFolder.path ? 'bg-teal-600' : ''}"
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
  <a href="https://www.cascadeonlinedesign.com" class="hidden md:block pb-4">
    <img src="/img/cascade_full_white.png" alt="Cascade Online Design" class="mx-auto w-full max-w-[130px]" />
  </a>
</nav>

<style>
  .selected {
    background-color: #2AC2C6;
  }
  .before\:content-\[\'\'\]::before {
    content: '';
  }
  .before\:h-full::before {
    height: 100%;
  }
  .before\:w-px::before {
    width: 1px;
  }
  .before\:bg-teal-600::before {
    background-color: #2AC2C6;
  }
  .before\:left-0::before {
    left: 0;
  }
  .before\:left-\[-8px\]::before {
    left: -8px;
  }
  .after\:content-\[\'\'\]::after {
    content: '';
  }
  .after\:h-px::after {
    height: 1px;
  }
  .after\:w-4::after {
    width: 1rem;
  }
  .after\:bg-teal-600::after {
    background-color: #2AC2C6;
  }
  .after\:left-\[-8px\]::after {
    left: -8px;
  }
  .after\:top-\[1\.25rem\]::after {
    top: 1.25rem;
  }
</style>
