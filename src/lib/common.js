import { writable } from "svelte/store";


export const user = writable({})
export const follow_list = writable([])
export const p = writable([])
export const ndk = writable({})

export const loaded = writable(false)