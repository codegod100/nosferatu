<script lang="ts">
  import { nip19 } from "nostr-tools";
  import type { User } from "$lib/User";
  import Thread from "$lib/Thread.svelte";
  import { user } from "$lib/common";
  export let data;
</script>

{#if $user && $user.metadata}
  <div class="h1">Hello {$user.metadata.display_name}</div>
  {#each $user.feed as feedItem}
    <Thread event={feedItem.event} relay={$user.relay} />
    <!-- <div>{feedItem.author.display_name}: {feedItem.event.content}</div> -->
  {/each}
{/if}
