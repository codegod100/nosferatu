<script lang="ts">
  import { newThread } from "$lib/Thread";
  import type { NRelay, NostrEvent } from "@nostrify/nostrify";
  import type { Thread } from "$lib/Thread";
  export let event: NostrEvent;
  export let relay: NRelay;
  let thread: Thread;
  async function getThread() {
    thread = await newThread(event, relay);
  }
</script>

{#if thread}
  <div>
    {thread.parent_item.author.display_name}: {thread.parent_item.event.content}
  </div>
  {#each thread.children as child}
    <div>{child.content}</div>
  {/each}
{/if}
