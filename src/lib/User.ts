import type { NRelay, NostrMetadata, NostrEvent } from "@nostrify/nostrify";
import { NSchema as n } from '@nostrify/nostrify';
import { verifyEvent, type VerifiedEvent } from 'nostr-tools';
export interface User {
    metadata: NostrMetadata,
    follow_list: string[]
    posts: NostrEvent[]
    feed: FeedItem[]
    relay: NRelay
}

export interface FeedItem {
    event: NostrEvent
    author: NostrMetadata
}


export async function newUser(pubkey: string, relay: NRelay): Promise<User> {
    let metadata: NostrMetadata = {}
    let follow_list: string[] = []
    let posts: NostrEvent[] = []
    let feed: FeedItem[] = []
    for await (const msg of await relay.query([
        { kinds: [0], authors: [pubkey], limit: 1 },
    ])) {
        metadata = n.json().pipe(n.metadata()).parse(msg.content);
    }
    // for (const msg of await relay.query([{ kinds: [1], authors: [pubkey], limit: 20 }])) {
    //     const event: VerifiedEvent = n.event().refine(verifyEvent).parse(msg);
    //     posts.push(event)
    // }

    for (const msg of await relay.query([{ kinds: [3], authors: [pubkey] }])) {
        const event: VerifiedEvent = n.event().refine(verifyEvent).parse(msg);

        for (const tag of event.tags) {
            if (tag[0] == "p") {
                follow_list.push(tag[1]);
            }
        }


    }
    feed = []
    for (const event of await relay.query([{ kinds: [1], authors: follow_list, limit: 20 }])) {
        let author: NostrMetadata = {}
        // for (const meta of await relay.query([{ kinds: [0], authors: [event.pubkey] }])) {
        //     author = n.json().pipe(n.metadata()).parse(meta.content);
        // }
        const item = { event, author }
        feed.push(item)
    }
    const user: User = { metadata, follow_list, posts, feed, relay }
    return user
}

