<script>
  import { user, loaded, ndk } from "$lib/common";
  import { onMount } from "svelte";
  import * as nip19 from "nostr-tools/nip19";
  import TimeAgo from "javascript-time-ago";
  import en from "javascript-time-ago/locale/en";
  TimeAgo.addDefaultLocale(en);
  import {
    EventCard,
    EventCardDropdownMenu,
    EventThread,
  } from "@nostr-dev-kit/ndk-svelte-components";
  export let events;
  export let profiles;
  const timeAgo = new TimeAgo("en-US");
  onMount(async () => {
    console.log("mounted");
  });
  const load_events = async () => {
    console.log("loading events");
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
      let last;
      for (let tag of event.tags) {
        if (tag[0] === "e") {
          last = nip19.noteEncode(tag[1]);
        }
      }
      console.log({ last });

      $ndk
        .fetchEvent(last)
        .then(async (ev) => {
          console.log("got event for last", ev);
          event.last = ev;
        })
        .catch((e) => {
          console.log("no last event", e);
        });

      for (let tag of event.tags) {
        if (tag[0] === "e") {
          console.log("fetching", tag[1]);
          const encoded = nip19.noteEncode(tag[1]);

          $ndk.fetchEvent(encoded).then(async (ev) => {
            console.log("got event", ev);
            event.events.push(ev);
          });
        }
        if (tag[0] === "r") {
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
    <div>
      <span class="font-bold">Event Id</span>:
      <a href="https://primal.net/e/{event.id_encoded}"> {event.id}</a>
    </div>
    <div><span class="font-bold">Content</span>: {event.content}</div>
    <div>
      <span class="font-bold">Created</span>: {timeAgo.format(
        new Date(event.created_at * 1000),
      )}
    </div>
    <div><span class="font-bold">Kind</span>: {event.kind}</div>
    {#each event.tags as tag}
      <div><span class="font-bold">Tag</span>: {tag[0]} {tag[1]}</div>
    {/each}
    <div>last id: {event.last && event.last.id}</div>
    <!-- <EventThread
      event={event.last || event}
      ndk={$ndk}
      on:open={() => alert("yolo")}
    /> -->
    {#if event.events.length > 0}
      <svelte:self events={event.events || []} {profiles} />
    {/if}
  </div>
{/each}
