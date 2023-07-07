import { writable } from 'svelte/store';

export const mousePos = writable<Vector>({ x: 0, y: 0});
export const menuOpen = writable<boolean>(false);