<!-- src/routes/+layout.svelte -->
<script lang="ts">
    export let data; // vem do +layout.server.ts

    async function logout() {
      await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      location.reload();
    }
    
  </script>
  
 
  
  <slot />
  
  
  
  