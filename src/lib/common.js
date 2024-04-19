import { writable } from "svelte/store";


export const user = writable({})
export const follow_list = writable([])
export const p = writable([])
export const ndk = writable({})
export const profiles = writable({})

export const loaded = writable(false)

export const getparent = async ({ event, relay }) => {
    const tags = event.tags
    let _parent = null
    console.log({ event, tags })
    for (const tag of tags) {
        if (tag[0] == "e") {
            _parent = tag[1]
        }
    }
    console.log({ _parent })
    if (_parent) {
        let _posts = await relay.query([{ ids: [_parent] }])
        let _post = _posts[0]
        console.log({ _post })
        if (!_post) {
            return {}
        }
        let _authors = await relay.query([{ kinds: [0], authors: [_post.pubkey] }])
        let _author = _authors[0]
        console.log({ _author })
        if (_author) {
            const _author_content = JSON.parse(_author.content)
            console.log({ _author_content })
            _post.author = _author_content.display_name || _author_content.name

        }
        return _post
    }


    return {}
}