<script lang="ts">
	import { onMount } from 'svelte';
	import type { FileItem } from '$lib/types';

	export let selectedFolder = '';
	export let selectedFiles: string[] = [];
	
  let files: FileItem[] = [];
	let selectedFile: FileItem | null = null;
	let selectedFileIndex: number = 0;
	let checkedFiles: Record<string, boolean> = {};

	async function fetchFiles() {
		const response = await fetch(`/api/files?path=${encodeURIComponent(selectedFolder)}`);
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
			selectedFiles = [...selectedFiles, filePath];
		} else {
			selectedFiles = selectedFiles.filter((path) => path !== filePath);
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
		if (selectedFolder) {
			fetchFiles();
		}
	}
</script>

<div class="">
	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0">
		{#each files as file (file.path)}
			<div
				class="bg-gray-800 relative cursor-pointer group"
				on:click|stopPropagation={() => openPreview(file)}
			>
				<div class="absolute top-0 left-0 p-2 z-10">
					<input
						type="checkbox"
						class="form-checkbox h-5 w-5 text-xteal {checkedFiles[file.path]
							? ''
							: 'opacity-0'} group-hover:opacity-100 transition-opacity duration-200 image-checkbox"
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

{#if selectedFile}
	<div
		class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50"
		on:click={closePreview}
	>
		<div class="relative w-full h-full max-h-[100vh] max-w-[100vw] m-auto" on:click|stopPropagation>
			{#if selectedFile.type === 'image'}
				<img
					src={selectedFile.fullUrl}
					alt={selectedFile.name}
					class="w-auto h-auto max-h-full max-w-full m-auto rounded-md"
				/>
			{:else if selectedFile.type === 'video'}
				<video
					src={selectedFile.fullUrl}
					class="w-auto h-auto max-h-full max-w-full m-auto rounded-md"
					controls
				/>
			{/if}
			<div class="absolute top-0 left-0 p-2 z-50">
				<input
					type="checkbox"
					class="form-checkbox h-8 w-8 text-xteal rounded-full"
					bind:checked={checkedFiles[selectedFile.path]}
					on:click|stopPropagation={(event) => toggleFileSelection(event, selectedFile?.path)}
				/>
			</div>
			<button
				class="absolute top-0 right-0 m-4 text-white text-3xl font-bold focus:outline-none z-50"
				on:click={closePreview}
			>
				&times;
			</button>
		</div>
		{#if selectedFileIndex > 0}
			<button
				class="absolute left-5 top-1/2 transform -translate-y-1/2 text-white text-4xl font-bold focus:outline-none z-50"
				on:click={goToPreviousFile}
			>
				&lt;
			</button>
		{/if}
		{#if selectedFileIndex < files.length - 1}
			<button
				class="absolute right-5 top-1/2 transform -translate-y-1/2 text-white text-4xl font-bold focus:outline-none z-50"
				on:click={goToNextFile}
			>
				&gt;
			</button>
		{/if}
	</div>
{/if}
