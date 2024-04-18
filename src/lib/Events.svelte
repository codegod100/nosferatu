<script>
  import { user, loaded, ndk } from "$lib/common";
  import { onMount, beforeUpdate } from "svelte";
  import * as nip19 from "nostr-tools/nip19";
  import TimeAgo from "javascript-time-ago";
  import en from "javascript-time-ago/locale/en";
  import { Avatar } from "@skeletonlabs/skeleton";
  TimeAgo.addDefaultLocale(en);
  import {
    EventCard,
    EventCardDropdownMenu,
    EventThread,
  } from "@nostr-dev-kit/ndk-svelte-components";
  export let events;
  export let profiles;
  const timeAgo = new TimeAgo("en-US");
  beforeUpdate(async () => {
    load_events();
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
            ev.id_encoded = encoded;
            console.log("got event", ev);
            event.events.push(ev);
          });
        }
        if (tag[0] === "r") {
        }
      }
    }
  };
</script>

{#each events as event}
  <div class="grid grid-flow-col auto-cols-max inline-block align-middle">
    <div>
      <Avatar
        src={profiles[event.author.pubkey] &&
          profiles[event.author.pubkey].image}
      />
    </div>
    <div class="">
      {profiles[event.author.pubkey] &&
        profiles[event.author.pubkey].displayName}
    </div>
  </div>
  <div>
    <div>{event.content}</div>
    <div>
      <a href="https://primal.net/e/{event.id_encoded || event.id}">
        <span class="font-bold">Created</span>: {timeAgo.format(
          new Date(event.created_at * 1000),
        )}
      </a>
    </div>
    <div><span class="font-bold">Kind</span>: {event.kind}</div>
    {#each event.tags as tag}
      <div><span class="font-bold">Tag</span>: {tag[0]} {tag[1]}</div>
      {#if tag[0] == "r"}
        <img src={tag[1]} />
      {/if}
    {/each}
    <div>last id: {event.last && event.last.id}</div>
    <!-- <EventThread
      event={event.last || event}
      ndk={$ndk}
      on:open={() => alert("yolo")}
    /> -->
    {#if event.events.length > 0}
      <div>Nested:</div>
      <svelte:self events={event.events || []} {profiles} />
    {/if}
  </div>
{/each}
