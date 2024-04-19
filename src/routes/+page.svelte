<script>
  import { user, p, profiles, follow_list, loaded, ndk } from "$lib/common";
  import { nip19 } from "nostr-tools";
  import {
    EventCard,
    EventCardDropdownMenu,
    EventThread,
  } from "@nostr-dev-kit/ndk-svelte-components";
  import { preloadData } from "$app/navigation";
  export let data;
  console.log(data);
  const profile = (pubkey) => {
    let _profile = $profiles[pubkey];
    if (_profile) {
      return _profile.display_name || _profile.name;
    }

    return "";
  };
</script>

<div class="h1">Hello {$user.display_name}</div>
{#each $p as post}
  {#if post.parent.author}
    <div class="p-2">
      <a href="https://primal.net/e/{nip19.noteEncode(post.parent.id)}"
        >{post.parent && post.parent.author}</a
      >:
      {post.parent && post.parent.content}
      <div class="p-2">
        <a href="https://primal.net/e/{nip19.noteEncode(post.id)}"
          >{profile(post.pubkey)}</a
        >: {post.content}
      </div>
    </div>
  {:else}
    <div class="p-2">
      <a href="https://primal.net/e/{nip19.noteEncode(post.id)}"
        >{profile(post.pubkey)}</a
      >: {post.content}
    </div>
  {/if}
{/each}
