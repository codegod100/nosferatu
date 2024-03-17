<script>
  import { profile, events, loaded } from "$lib/common";
</script>

loaded: {$loaded}
{#if $loaded}
  <div class="h1">Hello {$profile.displayName}</div>

  {#each $events as event}
    <div>{event.content}</div>
  {/each}
{/if}
