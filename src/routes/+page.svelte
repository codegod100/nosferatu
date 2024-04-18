<script>
  import { user, p, follow_list, loaded, ndk } from "$lib/common";
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
    const filter = { kinds: [1], authors: pubKeys, limit: 30 };
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

<div class="h1">Hello {$user.display_name}</div>
{#each $p as post}
  <div>{post.content}</div>
{/each}
