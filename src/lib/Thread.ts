import type { NRelay, NostrEvent } from "@nostrify/nostrify";

interface Thread {
    parent_event: NostrEvent
    children: NostrEvent[]
}

async function newThread(event: NostrEvent, relay: NRelay): Promise<Thread> {
    let children: NostrEvent[] = []
    for (const tag of event.tags) {
        if (tag[0] == "e") {
            const eventId = tag[1]
            children = await relay.query([{ kinds: [1], ids: [eventId] }])

        }
    }
    const thread: Thread = { parent_event: event, children }
    return thread
}