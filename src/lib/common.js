import { writable } from "svelte/store";


export const user = writable({})
export const ndk = writable({})

export const loaded = writable(false)