<script lang="ts">
  import "../app.postcss";
  import NDK, { NDKNip07Signer, NDKEvent } from "@nostr-dev-kit/ndk";
  import { NRelay1, NSchema as n } from "@nostrify/nostrify";
  import { user } from "$lib/common";
  import { newUser } from "$lib/User";
  import { verifyEvent } from "nostr-tools/pure";
  import { nip19 } from "nostr-tools";
  import NDKSvelte from "@nostr-dev-kit/ndk-svelte";
  // Highlight JS
  import hljs from "highlight.js/lib/core";
  import "highlight.js/styles/github-dark.css";
  import { storeHighlightJs } from "@skeletonlabs/skeleton";
  import xml from "highlight.js/lib/languages/xml"; // for HTML
  import css from "highlight.js/lib/languages/css";
  import javascript from "highlight.js/lib/languages/javascript";
  import typescript from "highlight.js/lib/languages/typescript";

  hljs.registerLanguage("xml", xml); // for HTML
  hljs.registerLanguage("css", css);
  hljs.registerLanguage("javascript", javascript);
  hljs.registerLanguage("typescript", typescript);
  storeHighlightJs.set(hljs);

  // Floating UI for Popups
  import {
    computePosition,
    autoUpdate,
    flip,
    shift,
    offset,
    arrow,
  } from "@floating-ui/dom";
  import { storePopup } from "@skeletonlabs/skeleton";
  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  const init = async () => {
    console.log("looking");
    const relay = new NRelay1("wss://relay.damus.io");
    const pubkey = await window.nostr.getPublicKey();
    $user = await newUser(pubkey, relay);
  };

  if (browser) {
    init();
  }
</script>

<button
  on:click={async () => {
    init();
  }}>Update</button
>
<slot />
