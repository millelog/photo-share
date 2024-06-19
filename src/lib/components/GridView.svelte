<!-- src/lib/components/GridView.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import DownloadButton from './DownloadButton.svelte';
	import ImageViewer from './ImageViewer.svelte';
	import type { FileItem } from '$lib/types';
	import { selectedFilesStore } from '$lib/stores/selectedFilesStore';
	import { writable } from 'svelte/store';

	export let currentSelectedFolder = '';

	let files: FileItem[] = [];
	let selectedFiles: string[] = [];
	let selectedFile: FileItem | null = null;
	let selectedFileIndex: number = 0;
	let checkedFiles: Record<string, boolean> = {};
	let loading = writable(false);

	$: {
		selectedFiles = $selectedFilesStore;
		initializeCheckedFiles();
	}

	function initializeCheckedFiles() {
		checkedFiles = selectedFiles.reduce(
			(acc, filePath) => {
				acc[filePath] = true;
				return acc;
			},
			{} as Record<string, boolean>
		);
	}

	async function fetchFiles() {
		loading.set(true);
		const viewportWidth = window.innerWidth;
		const response = await fetch(
			`/api/files?path=${encodeURIComponent(currentSelectedFolder)}&viewportWidth=${viewportWidth}`
		);
		files = await response.json();
		initializeCheckedFiles();
		loading.set(false);
	}

	function openPreview(file: FileItem) {
		selectedFile = file;
		selectedFileIndex = files.findIndex((f) => f.path === file.path);
	}

	function closePreview() {
		selectedFile = null;
	}

	function toggleFileSelection(event: MouseEvent, filePath?: string) {
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

<div class="relative">
	{#if $loading}
		<div class="flex items-center justify-center h-[90vh]">
			<svg
				class="animate-spin h-8 w-8 text-white"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
		</div>
	{:else}
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
					<img src={file.previewUrl} alt={file.name} class="w-full h-48 object-cover" />
					<div
						class="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black bg-opacity-50 {file.type ==
						'image'
							? 'opacity-0'
							: ''} group-hover:opacity-100 transition-opacity duration-200"
					>
						<p class="text-sm truncate text-white">{file.name}</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	{#if selectedFile}
		<ImageViewer
			file={selectedFile}
			{checkedFiles}
			{currentSelectedFolder}
			on:close={closePreview}
			on:previous={goToPreviousFile}
			on:next={goToNextFile}
			on:select={(event) => toggleFileSelection(event.detail.event, event.detail.path)}
		/>
	{/if}
</div>
