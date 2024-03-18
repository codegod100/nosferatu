<script>
  import { user, loaded, ndk } from "$lib/common";
  import * as nip19 from "nostr-tools/nip19";
  import Events from "$lib/Events.svelte";
  $: events_loaded = false;
  let events = [];
  let profiles = {};
  const follows = async () => {
    console.log("looking");
    const _follows = await $user.follows();
    const _af = Array.from(_follows);
    const pubKeys = _af.map((f) => f.pubkey);
    const filter = { kinds: [1, 6], authors: pubKeys, limit: 50 };
    console.log("grabbing events", filter);

    events = await $ndk.fetchEvents(filter);
    for (let event of events) {
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
    events_loaded = true;
    console.log("events", events);
  };
  if ($loaded) {
    console.log("loaded");
    follows();
  }
</script>

loaded: {$loaded}
<button class="btn variant-filled" on:click={follows}>Feed</button>
{#if $loaded}
  <div class="h1">Hello {$user.profile.displayName}</div>
  {#if events_loaded}
    Events loaded
    <Events {events} {profiles} />
  {/if}
{/if}
