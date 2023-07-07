<script lang="ts">
	import { onMount } from 'svelte';
	import { lerp, randInt } from '$lib/math';
	import { menuOpen, mousePos } from '../stores/cursor';

	export let size: Vector = { x: 300, y: 200 };
	export let position: Vector = { x: 100, y: 100 };
	export let rotation: number = randInt(-20, 20);
	export let speed: number = 0.2;

	let currPosition: Vector = { x: position.x, y: position.y };
	let targetPosition: Vector = { x: position.x, y: position.y };

	let currRotation: number = rotation;
	let targetRotation: number = rotation;

  // TODO: Selection of cards
	let wasClicked = false;
	$: if (!$menuOpen) {
		wasClicked = false;
	}
	$: isSelected = wasClicked && $menuOpen;

	function tick() {
		currRotation = lerp(currRotation, targetRotation, speed);
		currPosition.x = lerp(currPosition.x, targetPosition.x, speed);
		currPosition.y = lerp(currPosition.y, targetPosition.y, speed);
		requestAnimationFrame(tick);
	}

	function handleMouseDown() {
		wasClicked = true;
		targetPosition = { x: $mousePos.x - size.x / 2, y: $mousePos.y - size.y / 2 };
		targetRotation = 0;
	}

	function handleMouseUp() {
		wasClicked = false;
		targetPosition = position;
		targetRotation = rotation;
	}

	function setInitialPosition() {
		size = {
			x: (window.innerWidth - 100) / 4,
			y: randInt(200, 500)
		};
		position = {
			x: randInt(0, window.innerWidth - size.x),
			y: randInt(0, window.innerHeight)
		};
		rotation = randInt(-20, 20);
		targetPosition = position;
		targetRotation = rotation;
	}

	onMount(() => {
		setInitialPosition();
		requestAnimationFrame(tick);
	});
</script>

<div
	class="window"
	class:isSelected
	on:mousedown={handleMouseDown}
	on:mouseup={handleMouseUp}
	role="tab"
	tabindex="0"
	style:--window-width={`${size.x}px`}
	style:--window-height={`${size.y}px`}
	style:transform={`translate(${currPosition.x}px, ${currPosition.y}px) rotate(${currRotation}deg)`}
>
	<slot />
</div>

<style>
	.window {
		position: absolute;
		width: var(--window-width);
		height: var(--window-height);
		background-color: white;
		border: 1px solid #666;
	}

	.window.isSelected {
		z-index: 1;
		box-shadow: 0 0 50px 0 rgba(0, 0, 0, 0.2);
	}
</style>
