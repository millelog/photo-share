<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { selectedFolder } from '$lib/stores/selectedFolderStore';
  
    // Dynamically construct the selected folder based on the URL path
    onMount(() => {
      const pathSegments = $page.url.pathname.split('/').filter(Boolean);
      const separator = process.env.NODE_ENV === 'production' ? '/' : '\\';
      selectedFolder.set(pathSegments.join(separator));
    });
  </script>