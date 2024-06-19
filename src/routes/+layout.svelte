<!--routes/+layout.svelte-->
<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import FolderNav from '$lib/components/FolderNav.svelte';
	import GridView from '$lib/components/GridView.svelte';
	import DownloadButton from '$lib/components/DownloadButton.svelte';
	import type { FolderItem } from '$lib/types';
	import { selectedFolder } from '$lib/stores/selectedFolderStore';
	import { selectedFilesStore } from '$lib/stores/selectedFilesStore';
	import Footer from '$lib/components/Footer.svelte';
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';

	let folderTree: FolderItem[] = [{ name: '', path: '' }];
	let currentSelectedFolder = '';
	let currentUrl = '';
	let isLoading = writable(true);

	$: selectedFiles = $selectedFilesStore;

	selectedFolder.subscribe((value) => {
		currentSelectedFolder = value;
	});

	async function fetchFolderTree() {
		isLoading.set(true);
		const response = await fetch('/api/folders');
		folderTree = await response.json();
		isLoading.set(false);
	}

	function handleFolderSelected(event: CustomEvent<string>) {
		selectedFolder.set(event.detail);
	}

	async function selectAll() {
		const response = await fetch(`/api/files?path=${encodeURIComponent(currentSelectedFolder)}`);
		const files = await response.json();
		const allSelected = files.every((file: { path: string }) => selectedFiles.includes(file.path));

		if (allSelected) {
			files.forEach((file: { path: string }) => {
				selectedFilesStore.remove(file.path);
			});
		} else {
			files.forEach((file: { path: string }) => {
				selectedFilesStore.add(file.path);
			});
		}

		const checkboxes = document.querySelectorAll('.image-checkbox');
		checkboxes.forEach((checkbox) => {
			(checkbox as HTMLInputElement).checked = !allSelected;

			// Create a new event
			const event = new Event('change', {
				bubbles: true,
				cancelable: true
			});

			// Dispatch the event
			checkbox.dispatchEvent(event);
		});
	}

	function getFolderName(filePath: string) {
		const separator = process.env.NODE_ENV === 'production' ? '/' : '\\';
		//capitalize first letter after spaces or first char
		return (filePath.split(separator).pop() ?? '').replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
			letter.toUpperCase()
		);
	}

	function getPathName(filePath: string) {
		const separator = process.env.NODE_ENV === 'production' ? '/' : '\\';
		const segments = filePath.split(separator).filter(Boolean);
		const lastTwoSegments = segments.slice(-2); // Get the last two segments

		return lastTwoSegments
			.map((segment) => segment.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase()))
			.join(' ');
	}

	onMount(() => {
		fetchFolderTree();
		page.subscribe((p: { url: { href: string } }) => {
			currentUrl = p.url.href;
		});
	});
</script>

<svelte:head>
	<title
		>{currentSelectedFolder
			? `${getPathName(currentSelectedFolder)} - Photo Share`
			: 'Photo Share - Cascade Online'}
	</title>
	<meta
		name="description"
		content="A powerful and user-friendly photo sharing app allowing seamless navigation, previewing, and downloading of media files."
	/>
	<meta name="keywords" content="photo, sharing, app, media, gallery, preview, download" />
	<meta name="author" content="Cascade Online" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="icon" type="image/png" href="/favicon.png" />
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta
		property="og:title"
		content={currentSelectedFolder
			? `${getFolderName(currentSelectedFolder)} - Photo Share`
			: 'Photo Share - Cascade Online'}
	/>
	<meta
		property="og:description"
		content="A powerful and user-friendly photo sharing app allowing seamless navigation, previewing, and downloading of media files."
	/>
	<meta property="og:image" content="/img/cascade_full_white.png" />
	<meta property="og:url" content={currentUrl} />
	<meta property="og:site_name" content="Photo Share - Cascade Online" />
	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta
		name="twitter:title"
		content={currentSelectedFolder
			? `${getPathName(currentSelectedFolder)} - Photo Share`
			: 'Photo Share - Cascade Online'}
	/>
	<meta
		name="twitter:description"
		content="A powerful and user-friendly photo sharing app allowing seamless navigation, previewing, and downloading of media files."
	/>
	<meta name="twitter:image" content="/img/cascade_full_white.png" />

	<script defer data-domain="photos.loganmiller.dev" src="https://plausible.loganmiller.dev/js/script.js"></script>
</svelte:head>

<div class="flex flex-col md:flex-row h-[100vh] bg-xgray text-white">
	<div class="md:w-64 bg-xgray md:h-full">
	  <FolderNav {folderTree} on:folderSelected={handleFolderSelected} />
	</div>
	<div class="flex-1 overflow-y-scroll h-full flex flex-col justify-between">
	  <div>
		<div class="sticky top-0 bg-xgray z-20 flex items-center justify-between">
		  <h1 class="text-sm md:text-2xl font-bold p-2 md:p-3 text-wrap shrink ">
			{currentSelectedFolder ? getPathName(currentSelectedFolder) : 'Select a Folder'}
		  </h1>
		  <div class="flex items-center">
			<button
			  class="bg-xteal hover:bg-xdteal text-xgray font-bold py-2 md:py-4 px-1 md:px-4 h-full cursor-pointer focus:outline-none mr-1 text-nowrap text-sm md:text-base"
			  on:click={selectAll}
			>
			  Select All
			</button>
			<DownloadButton {currentSelectedFolder} />
		  </div>
		</div>
		{#if $isLoading}
		  <div class="flex items-center justify-center h-[90vh]">
			<svg
			  class="animate-spin h-8 w-8 text-white"
			  xmlns="http://www.w3.org/2000/svg"
			  fill="none"
			  viewBox="0 0 24 24"
			>
			  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
			  <path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			  ></path>
			</svg>
		  </div>
		{:else}
		  <GridView {currentSelectedFolder} />
		{/if}
	  </div>
	  <Footer />
	</div>
  </div>
  <slot />