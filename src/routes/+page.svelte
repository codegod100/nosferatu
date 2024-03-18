<script>
  import { user, loaded, ndk } from "$lib/common";
  let events_loaded = false;
  let events = [];
  let profiles = {};
  const follows = async () => {
    console.log("looking");
    const _follows = await $user.follows();
    const _af = Array.from(_follows);
    const pubKeys = _af.map((f) => f.pubkey);
    const filter = { kinds: [1, 6, 7], authors: pubKeys, limit: 100 };
    console.log("grabbing events", filter);

    events = await $ndk.fetchEvents(filter);
    for (const event of events) {
      if (!profiles[event.author.pubkey]) {
        console.log("grabbing profile", event.author.pubkey);
        await event.author.fetchProfile();
        profiles[event.author.pubkey] = event.author.profile;
      } else {
        console.log("already have profile", event.author.profile);
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
{#if $loaded}
  <div class="h1">Hello {$user.profile.displayName}</div>
  {#if events_loaded}
    {#each events as event}
      <div>
        {event.content}
        {event.kind}
        {profiles[event.author.pubkey].displayName}
      </div>
    {/each}
  {/if}
  <button class="btn variant-filled" on:click={follows}>Feed</button>
{/if}
