<script>
  import "../app.postcss";
  import NDK, { NDKNip07Signer, NDKEvent } from "@nostr-dev-kit/ndk";
  import { profile, events, loaded } from "$lib/common";
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

  let moo = 42;
  import { onMount } from "svelte";
  onMount(async () => {
    const nip07signer = new NDKNip07Signer();
    const ndk = new NDK({
      signer: nip07signer,
      explicitRelayUrls: ["wss://nos.lol"],
    });
    await ndk.connect();
    nip07signer.user().then(async (user) => {
      if (!!user.npub) {
        console.log("ping");
        console.log(user.pubkey);
        const filter = { kinds: [1], authors: [user.pubkey] };
        $events = await ndk.fetchEvents(filter);
        console.log(events);
        await user.fetchProfile();
        $profile = user.profile;
        $loaded = true;
        console.log("Permission granted to read their public key:", user);
      }
    });
  });
</script>

<slot />
