<script>
  import { user, p, profiles, follow_list, loaded, ndk } from "$lib/common";
</script>

<div class="h1">Hello {$user.display_name}</div>
{#each $p as post}
  <div class="p-2">
    {$profiles[post.pubkey].display_name || $profiles[post.pubkey].name}: {post.content}
  </div>
{/each}
