import { user, p, profiles, follow_list, loaded, ndk } from "$lib/common";
import { get } from "svelte/store";
export function load({ params }) {
    return {
        yolo: get(user)
    };
}