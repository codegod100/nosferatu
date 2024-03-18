<script>
  import { user, loaded, ndk } from "$lib/common";
  import * as nip19 from "nostr-tools/nip19";
  export let events;
  export let profiles;
  const load_events = async () => {
    for (let event of events) {
      event.id_encoded = nip19.noteEncode(event.id);
      if (!profiles[event.author.pubkey]) {
        console.log("grabbing profile", event.author.pubkey);
        await event.author.fetchProfile();
        profiles[event.author.pubkey] = event.author.profile;
      } else {
        console.log("already have profile", event.author.profile);
      }
      event.events = [];
      for (let tag of event.tags) {
        if (tag[0] === "e") {
          console.log("fetching", tag[1]);
          const encoded = nip19.noteEncode(tag[1]);

          $ndk.fetchEvent(encoded).then(async (ev) => {
            console.log("got event", ev);
            event.events.push(ev);
          });
        }
      }
    }
  };
  load_events();
</script>

{#each events as event}
  <div class="p-2">
    <div>
      <span class="font-bold">Display name</span>: {profiles[
        event.author.pubkey
      ] && profiles[event.author.pubkey].displayName}
    </div>
    <div><span class="font-bold">Event Id</span>: {event.id_encoded}</div>
    <div><span class="font-bold">Content</span>: {event.content}</div>
    <div><span class="font-bold">Created</span>: {event.created_at}</div>
    <div><span class="font-bold">Kind</span>: {event.kind}</div>
    {#each event.tags as tag}
      <div><span class="font-bold">Tag</span>: {tag[0]} {tag[1]}</div>
    {/each}
    {#if event.events.length > 0}
      <svelte:self events={event.events || []} {profiles} />
    {/if}
  </div>
{/each}
