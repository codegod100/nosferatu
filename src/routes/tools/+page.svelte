<script>
  import { profile, events, loaded } from "$lib/common";
</script>

{#if $loaded}
  Hello {$profile.displayName}
{/if}
