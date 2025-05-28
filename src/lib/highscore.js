import { browser } from "$app/environment";
import { writable } from "svelte/store";

/* initialize the users to "" if the users has not already been stored */
const highscore = browser ? window?.localStorage.getItem('highscore') ?? "" : ""

export const savedScore = writable(highscore)

if (browser) {
        /* https://svelte.dev/tutorial/auto-subscriptions */
        savedScore.subscribe((value) => {
                /* on changes to the users_store, update the localStorage in the browser. */
                window?.localStorage.setItem('users', value);
        })
}
