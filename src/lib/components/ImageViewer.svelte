<!-- src/lib/components/ImageViewer.svelte -->
<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { FileItem } from '$lib/types';
	import DownloadButton from './DownloadButton.svelte';

	export let file: FileItem;
	export let checkedFiles: Record<string, boolean>;
	export let currentSelectedFolder: string;

	let loading = true;
	let fullSize: number;
	let touchStartX = 0;

	const dispatch = createEventDispatcher();

	function updateFullUrl() {
		if (file.type === 'image') {
			const viewportWidth = window.innerWidth;
			fullSize = getFullSize(viewportWidth);
			file.fullUrl = `/api/image?path=${encodeURIComponent(file.path)}&size=${fullSize}`;
		}
	}

	onMount(updateFullUrl);

	$: {
		if (file) {
			updateFullUrl();
			loading = true;
		}
	}

	function getFullSize(viewportWidth: number): number {
		if (viewportWidth <= 640) {
			return 800;
		} else if (viewportWidth <= 1024) {
			return 1200;
		} else {
			return 1600;
		}
	}

	function handleClose() {
		dispatch('close');
	}

	function handlePrevious() {
		dispatch('previous');
	}

	function handleNext() {
		dispatch('next');
	}

	function handleSelect(event: Event) {
		dispatch('select', {
			event,
			path: file.path
		});
	}

	function handleImageLoad() {
		loading = false;
	}

	function handleVideoLoad() {
		loading = false;
	}

	function handleTouchStart(event: TouchEvent) {
		touchStartX = event.touches[0].clientX;
	}

	function handleTouchEnd(event: TouchEvent) {
		const touchEndX = event.changedTouches[0].clientX;
		const touchDiff = touchStartX - touchEndX;

		if (touchDiff > 50) {
			handleNext();
		} else if (touchDiff < -50) {
			handlePrevious();
		}
	}
</script>

<div
	class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50"
	on:click={handleClose}
	on:touchstart={handleTouchStart}
	on:touchend={handleTouchEnd}
>
	<div class="relative w-auto h-auto max-h-[90vh] max-w-[90vw] m-auto" on:click|stopPropagation>
		<div class="relative">
			{#if loading}
				<div class="fixed inset-0 flex items-center justify-center">
					<svg
						class="animate-spin h-8 w-8 text-white absolute"
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
				<div class="absolute top-0 left-0 p-2">
					<input
						type="checkbox"
						class="form-checkbox h-8 w-8 accent-xteal rounded-full cursor-pointer"
						checked={checkedFiles[file.path]}
						on:change={handleSelect}
					/>
				</div>
				<button
					class="absolute top-0 right-1 m-2 text-white text-3xl font-bold focus:outline-none"
					on:click={handleClose}
				>
					&times;
				</button>
				<div class="absolute bottom-1 left-0 right-0 flex justify-center">
					<DownloadButton {currentSelectedFolder} filePath={file.path} />
				</div>
			{/if}
			{#if file.type === 'image'}
				<img
					src={file.fullUrl}
					alt={file.name}
					class="w-auto h-auto max-h-[90vh] max-w-[90vw] m-auto rounded-md"
					on:load={handleImageLoad}
				/>
			{:else if file.type === 'video'}
				<video
					src={file.fullUrl}
					class="w-auto h-auto max-h-[90vh] max-w-[90vw] m-auto rounded-md"
					controls
					on:loadedmetadata={handleVideoLoad}
				/>
			{/if}
			<button
				class="fixed left-1 md:left-5 top-1/2 transform -translate-y-1/2 text-white text-4xl md:text-7xl font-bold focus:outline-none hover:text-xteal"
				on:click={handlePrevious}
			>
				&lsaquo;
			</button>
			<button
				class="fixed right-1 md:right-5 top-1/2 transform -translate-y-1/2 text-white text-4xl md:text-7xl font-bold focus:outline-none hover:text-xteal"
				on:click={handleNext}
			>
				&rsaquo;
			</button>
		</div>
	</div>
</div>
