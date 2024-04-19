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
  getThread();
</script>

{#if thread && thread.parent_item.author}
  <div>
    {thread.parent_item.author.display_name}: {thread.parent_item.event.content}
    {#each thread.children as child}
      {#if child.author}
        <div class="p-2">
          {child.author.display_name}: {child.event.content}
        </div>
      {/if}
    {/each}
  </div>
{/if}
