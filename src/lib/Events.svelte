<script>
  export let events;
  export let profiles;
</script>

{#each events as event}
  <div class="p-2">
    <div>
      <span class="font-bold">Display name</span>: {profiles[
        event.author.pubkey
      ] && profiles[event.author.pubkey].displayName}
    </div>
    <div><span class="font-bold">Content</span>: {event.content}</div>
    <div><span class="font-bold">Created</span>: {event.created_at}</div>
    <div><span class="font-bold">Kind</span>: {event.kind}</div>
    {#each event.tags as tag}
      <div><span class="font-bold">Tag</span>: {tag[0]} {tag[1]}</div>
    {/each}
    {console.log(event.events.length)}
    {#if event.events.length > 0}
      <svelte:self events={event.events || []} {profiles} />
    {/if}
  </div>
{/each}
