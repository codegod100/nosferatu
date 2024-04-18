<script>
  import "../app.postcss";
  import NDK, { NDKNip07Signer, NDKEvent } from "@nostr-dev-kit/ndk";
  import { NRelay1, NSchema as n } from "@nostrify/nostrify";
  import { user, p, follow_list, loaded, ndk } from "$lib/common";
  import { verifyEvent } from "nostr-tools/pure";
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
    for await (const msg of relay.req([{ kinds: [0, 3], authors: [pubkey] }])) {
      // console.log({ msg });
      if (msg[0] === "EVENT") {
        if (msg[2].kind == 0) {
          const metadata = n.json().pipe(n.metadata()).parse(msg[2].content);
          $user = metadata;
          console.log({ metadata });
        }
        if (msg[2].kind == 3) {
          // console.log({ msg });
          const event = n.event().refine(verifyEvent).parse(msg[2]);
          let _follow_list = [];
          for (const tag of event.tags) {
            // console.log({ tag });
            if (tag[0] == "p") {
              _follow_list.push(tag[1]);
            }
          }
          $follow_list = _follow_list;
          let posts = await relay.query([
            { kinds: [1], authors: _follow_list, limit: 20 },
          ]);
          let _posts = [];
          for (const post of posts) {
            let tags = post.tags.map((_tag) => _tag[0]);
            if (!tags.includes("e")) {
              _posts.push(post);
            }
          }
          $p = _posts;
          for (const post of _posts) {
            console.log({ post });
          }
          console.log({ follow_list });
          console.log({ event });
          console.log(msg[2]);
        }
      }
      if (msg[0] === "EOSE") break; // Sends a `CLOSE` message to the relay.
    }
    console.log({ pubkey });
  };
  if (browser) {
    init();
  }
</script>

<slot />
