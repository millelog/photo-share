<!-- src/lib/components/DownloadButton.svelte -->
<script lang="ts">
    export let currentSelectedFolder = '';
    export let selectedFiles: string[] = [];

    let isDownloading = false;
  
    async function handleDownload() {
      isDownloading = true;
  
      try {
        const response = await fetch(`/api/download?folder=${currentSelectedFolder}`, {
          method: 'POST',
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
      } catch (error) {
        console.error('Error downloading files:', error);
        // Handle error scenario
      }
  
      isDownloading = false;
    }
  </script>
  
  <button
    class="bg-xteal hover:bg-xdteal text-xgray font-bold py-4 md:py-5 px-4 h-full cursor-pointer focus:outline-none"
    on:click={handleDownload}
    disabled={!currentSelectedFolder || isDownloading}
  >
    {#if isDownloading}
      <svg
        class="animate-spin -ml-1 mr-3 h-5 w-5 text-xgray"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      Downloading...
    {:else}
      Download
    {/if}
  </button>