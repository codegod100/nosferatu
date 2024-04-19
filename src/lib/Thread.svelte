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
    <a href="https://primal.net/e/{thread.parent_item.event.id}"
      >{thread.parent_item.author.display_name ||
        thread.parent_item.author.name}</a
    >: {thread.parent_item.event.content}
    {#each thread.parent_item.event.tags as tag}
      <div>
        [{tag[0]}]
        <a href="https://primal.net/{tag[0]}/{tag[1]}"> {tag[1]}</a>
      </div>
      {#if tag[0] == "r"}
        <img src={tag[1]} class="max-w-60" />
      {/if}
    {/each}
    {#each thread.children as child}
      {#if child.author}
        <div class="p-2">
          <a href="https://primal.net/e/{child.event.id}"
            >{child.author.display_name || child.author.name}</a
          >: {child.event.content}
        </div>
        {#each child.event.tags as tag}
          <div class="p-2">
            [{tag[0]}]
            <a href="https://primal.net/{tag[0]}/{tag[1]}"> {tag[1]}</a>
          </div>
          {#if tag[0] == "r"}
            <img src={tag[1]} class="max-w-60" />
          {/if}
        {/each}
      {/if}
    {/each}
  </div>
{/if}
