<script lang="ts">
	import { onMount } from 'svelte';
	import Footer from './Footer.svelte';
	import DownloadButton from './DownloadButton.svelte';
	import type { FileItem } from '$lib/types';
	import { selectedFilesStore } from '$lib/stores/selectedFilesStore';
  
	export let currentSelectedFolder = '';

	
	let files: FileItem[] = [];
	let selectedFile: FileItem | null = null;
	let selectedFileIndex: number = 0;
	let checkedFiles: Record<string, boolean> = {};
  
	$: selectedFiles = $selectedFilesStore;
  
	async function fetchFiles() {
	  const response = await fetch(`/api/files?path=${encodeURIComponent(currentSelectedFolder)}`);
	  files = await response.json();
	  checkedFiles = {};
	  files.forEach((file) => {
		checkedFiles[file.path] = selectedFiles.includes(file.path);
	  });
	}
  
	function openPreview(file: FileItem) {
	  selectedFile = file;
	  selectedFileIndex = files.findIndex((f) => f.path === file.path);
	}
  
	function closePreview() {
	  selectedFile = null;
	}
  
	function toggleFileSelection(event: Event, filePath?: string) {
	  if (!filePath) return;
	  event.stopPropagation();
	  checkedFiles[filePath] = !checkedFiles[filePath];
	  if (checkedFiles[filePath]) {
		selectedFilesStore.add(filePath);
	  } else {
		selectedFilesStore.remove(filePath);
	  }
	}
  
	function goToPreviousFile() {
	  if (selectedFileIndex > 0) {
		selectedFileIndex--;
		selectedFile = files[selectedFileIndex];
	  }
	}
  
	function goToNextFile() {
	  if (selectedFileIndex < files.length - 1) {
		selectedFileIndex++;
		selectedFile = files[selectedFileIndex];
	  }
	}
  
	$: {
	  if (currentSelectedFolder) {
		fetchFiles();
	  }
	}
  </script>
  
  <div class="">
	<div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-0">
	  {#each files as file (file.path)}
		<div
		  class="bg-xgray relative cursor-pointer group"
		  on:click|stopPropagation={() => openPreview(file)}
		>
		  <div class="absolute top-0 left-0 p-2 z-10">
			<input
			  type="checkbox"
			  class="form-checkbox h-5 w-5 accent-xteal image-checkbox"
			  bind:checked={checkedFiles[file.path]}
			  on:click|stopPropagation={(event) => toggleFileSelection(event, file.path)}
			/>
		  </div>
		  {#if file.type === 'image'}
			<img src={file.previewUrl} alt={file.name} class="w-full h-48 object-cover" />
		  {:else if file.type === 'video'}
			<video src={file.fullUrl} class="w-full h-48 object-cover" />
		  {/if}
		  <div
			class="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
		  >
			<p class="text-sm truncate text-white">{file.name}</p>
		  </div>
		</div>
	  {/each}
	</div>
  </div>
  <Footer />
  {#if selectedFile}
	<div
	  class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50"
	  on:click={closePreview}
	>
	  <div class="relative w-auto h-auto max-h-[90vh] max-w-[90vw] m-auto" on:click|stopPropagation>
		<div class="relative">
		  {#if selectedFile.type === 'image'}
			<img
			  src={selectedFile.fullUrl}
			  alt={selectedFile.name}
			  class="w-auto h-auto max-h-[90vh] max-w-[90vw] m-auto rounded-md"
			/>
		  {:else if selectedFile.type === 'video'}
			<video
			  src={selectedFile.fullUrl}
			  class="w-auto h-auto max-h-[90vh] max-w-[90vw] m-auto rounded-md"
			  controls
			/>
		  {/if}
		  <div class="absolute top-0 left-0 p-2">
			<input
			  type="checkbox"
			  class="form-checkbox h-8 w-8 accent-xteal rounded-full cursor-pointer"
			  bind:checked={checkedFiles[selectedFile.path]}
			  on:click|stopPropagation={(event) => toggleFileSelection(event, selectedFile?.path)}
			/>
		  </div>
		  <button
			class="absolute top-0 right-0 m-2 text-white text-3xl font-bold focus:outline-none"
			on:click={closePreview}
		  >
			×
		  </button>
		  {#if selectedFileIndex > 0}
			<button
			  class="fixed left-1 md:left-5 top-1/2 transform -translate-y-1/2 text-white text-4xl md:text-7xl font-bold focus:outline-none hover:text-xteal"
			  on:click={goToPreviousFile}
			>
			  &lsaquo;
			</button>
		  {/if}
		  {#if selectedFileIndex < files.length - 1}
			<button
			  class="fixed right-1 md:right-5 top-1/2 transform -translate-y-1/2 text-white text-4xl md:text-7xl font-bold focus:outline-none hover:text-xteal"
			  on:click={goToNextFile}
			>
			  &rsaquo;
			</button>
		  {/if}
		  <div class="fixed bottom-2 md:absolute md:bottom-1 left-0 right-0 flex justify-center">
			<DownloadButton {currentSelectedFolder} filePath={selectedFile.path} />
		  </div>
		</div>
	  </div>
	</div>
  {/if}
  