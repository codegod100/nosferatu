<script>
  import "../app.postcss";
  import NDK, { NDKNip07Signer, NDKEvent } from "@nostr-dev-kit/ndk";
  import { user, loaded, ndk } from "$lib/common";
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
    const nip07signer = new NDKNip07Signer();
    const _ndk = new NDKSvelte({
      signer: nip07signer,
      explicitRelayUrls: ["wss://nos.lol"],
    });
    await _ndk.connect();
    $ndk = _ndk;
    nip07signer.user().then(async (_user) => {
      if (!!_user.npub) {
        await _user.fetchProfile();
        $user = _user;
        $loaded = true;
        console.log("Permission granted to read their public key:", _user);
      }
    });
  };
  if (browser) {
    init();
  }
</script>

<slot />
