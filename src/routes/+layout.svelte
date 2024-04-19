<script>
  import "../app.postcss";
  import NDK, { NDKNip07Signer, NDKEvent } from "@nostr-dev-kit/ndk";
  import { NRelay1, NSchema as n } from "@nostrify/nostrify";
  import {
    user,
    p,
    profiles,
    follow_list,
    loaded,
    ndk,
    getparent,
  } from "$lib/common";
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
    for await (const msg of await relay.query([
      { kinds: [0, 3], authors: [pubkey] },
    ])) {
      if (msg.kind == 0) {
        const metadata = n.json().pipe(n.metadata()).parse(msg.content);
        $user = metadata;
        console.log({ metadata });
      }
      if (msg.kind == 3) {
        const event = n.event().refine(verifyEvent).parse(msg);
        let _follow_list = [];

        for (const tag of event.tags) {
          if (tag[0] == "p") {
            _follow_list.push(tag[1]);
          }
        }
        $follow_list = _follow_list;
        let _profiles = await relay.query([
          { kinds: [0], authors: _follow_list },
        ]);
        for (const profile of _profiles) {
          const content = JSON.parse(profile.content);
          $profiles[profile.pubkey] = content;
        }
        let posts = await relay.query([
          { kinds: [1], authors: _follow_list, limit: 40 },
        ]);
        let _posts = [];
        for (const post of posts) {
          let parent = await getparent({ event: post, relay });
          post.parent = parent;
          let tags = post.tags.map((_tag) => _tag[0]);
          if (!tags.includes("k")) {
            // post.author = $profiles[post.pubkey];
            _posts.push(post);
          }
        }
        $p = _posts;
      }
    }
  };
  if (browser) {
    init();
  }
</script>

<slot />
