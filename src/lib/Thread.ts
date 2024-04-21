import type { NRelay, NostrEvent, NostrMetadata } from "@nostrify/nostrify";
import { NSchema as n } from '@nostrify/nostrify';
import * as nip19 from "nostr-tools/nip19";


export interface Thread {
    parent_item: FeedItem
    children: FeedItem[]
}

interface FeedItem {
    event: NostrEvent
    author: NostrMetadata
    body: string
}

async function replaceNpub(text: string, relay: NRelay) {
    const match = text.match(/nostr:npub\w*/);
    let npub: string = "";
    let author: NostrMetadata = {};
    if (match) {
        npub = match[0];
        const events = await relay.query([{ kinds: [0], authors: [npub] }]);
        if (events) {
            author = n.json().pipe(n.metadata()).parse(events[0].content);
        }
    }
    const name = author.name || npub;
    return text.replace(/nostr:npub\w*/, name);
}

async function grabItem(eventId: string, relay: NRelay): Promise<FeedItem> {
    const events = await relay.query([{ kinds: [1], ids: [eventId] }])
    if (events.length) {
        const author_events = await relay.query([{ kinds: [0], authors: [events[0].pubkey] }])
        if (author_events.length) {
            let author = n.json().pipe(n.metadata()).parse(author_events[0].content);
            return { event: events[0], author, body: await replaceNpub(events[0].content, relay) }

        }
    }
    return {} as FeedItem
}

export async function newThread(event: NostrEvent, relay: NRelay): Promise<Thread> {
    let children: FeedItem[] = []
    for (const tag of event.tags) {
        if (tag[0] == "e") {
            const eventId = tag[1]
            children.push(await grabItem(eventId, relay))

        }


    }

    const thread: Thread = { parent_item: await grabItem(event.id, relay), children }
    return thread
}