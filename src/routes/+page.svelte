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
    const filter = { kinds: [1, 6], authors: pubKeys, limit: 20 };
    console.log("grabbing events", filter);

    events = await $ndk.fetchEvents(filter);

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
