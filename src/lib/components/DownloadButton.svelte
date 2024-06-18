<!--src/lib/components/DownloadButton.svelte-->
<script lang="ts">
	import { selectedFilesStore } from '$lib/stores/selectedFilesStore';
	import { get } from 'svelte/store';

	export let currentSelectedFolder = '';
	export let filePath = ''; // Optional parameter

	let isDownloading = false;

	async function handleDownload() {
		isDownloading = true;

		try {
			const formData = new FormData();

			if (filePath) {
				formData.append('filePath', filePath);

				const response = await fetch('/api/download', {
					method: 'POST',
					body: formData
				});

				if (response.ok) {
					const blob = await response.blob();
					const url = window.URL.createObjectURL(blob);
					const link = document.createElement('a');
					link.href = url;
					link.download = filePath.split('/').pop() || 'downloaded_file';
					link.click();
					window.URL.revokeObjectURL(url);
				} else {
					console.error('Error downloading file:', response.statusText);
					// Handle error scenario
				}
			} else {
				const selectedFiles = get(selectedFilesStore);

				formData.append('folder', currentSelectedFolder);
				formData.append('filePaths', selectedFiles.join(','));

				const response = await fetch('/api/downloadSelected', {
					method: 'POST',
					body: formData
				});

				if (response.ok) {
					const blob = await response.blob();
					const url = window.URL.createObjectURL(blob);
					const link = document.createElement('a');
					link.href = url;
					link.download = `${currentSelectedFolder}.zip`;
					link.click();
					window.URL.revokeObjectURL(url);
				} else {
					console.error('Error downloading files:', response.statusText);
					// Handle error scenario
				}
			}
		} catch (error) {
			console.error('Error downloading files:', error);
			// Handle error scenario
		}

		isDownloading = false;
	}
</script>

<button
	class="bg-xteal hover:bg-xdteal text-xgray font-bold {filePath
		? 'py-1'
		: 'py-2'} px-1 md:px-4 h-full cursor-pointer text-sm md:text-base focus:outline-none {filePath ? 'md:py-2' : 'md:py-4'}"
	on:click={handleDownload}
	disabled={(!currentSelectedFolder && !filePath) || isDownloading}
>
	{#if isDownloading}
		<div class="flex flex-row">
			<svg
				class="animate-spin -ml-1 mr-3 h-5 w-5 text-xgray"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
			Downloading...
		</div>
	{:else if filePath !== ''}
		Save
	{:else}
		Download
	{/if}
</button>
