<script lang="ts">
	import { lerp } from '$lib/math';
	import { onMount } from 'svelte';

	export let size: Vector = { x: 300, y: 200 };
	export let position: Vector = { x: 400, y: 600 };
	export let rotation: number = 12;
	export let speed: number = 0.2;

	let currPosition: Vector = { x: position.x, y: position.y };
	let targetPosition: Vector = { x: position.x, y: position.y };

	let currRotation: number = rotation;
	let targetRotation: number = rotation;

	let isSnapped = false;

	function tick() {
		currRotation = lerp(currRotation, targetRotation, speed);
		currPosition.x = lerp(currPosition.x, targetPosition.x, speed);
		currPosition.y = lerp(currPosition.y, targetPosition.y, speed);
		requestAnimationFrame(tick);
	}

	function handleMouseDown(event: MouseEvent) {
		isSnapped = true;
		targetPosition = { x: event.clientX - size.x / 2, y: event.clientY - size.y / 2 };
		targetRotation = 0;
	}

	function handleMouseUp() {
		isSnapped = false;
		targetPosition = position;
		targetRotation = rotation;
	}

	onMount(() => {
		requestAnimationFrame(tick);
	});
</script>

<div
	class="window"
	class:isSnapped
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
		width: var(--window-width);
		height: var(--window-height);
		background-color: white;
		border: 1px solid #666;
	}

	.window.isSnapped {
		box-shadow: 0 0 50px 0 rgba(0, 0, 0, 0.2);
	}
</style>
