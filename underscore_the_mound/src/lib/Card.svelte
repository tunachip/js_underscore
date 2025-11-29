<script>
  import { onMount } from "svelte";
  import { nextZ } from "./zIndex.js";

  export let card;
  export let startFaceDown = false;

  // initial placement from parent
  export let initialX = 0;
  export let initialY = 0;
  export let initialAngle = 0;

  let x = 0;
  let y = 0;
  let rotation = 0;

  let z = 1;
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;
  let flipped = false;

  let container;

  onMount(() => {
    x = initialX;
    y = initialY;
    rotation = initialAngle;
    flipped = startFaceDown;
  });

  // shadow changes when dragging
  $: shadow = dragging
    ? "8px 12px 20px rgba(0,0,0,0.35)"   // lifted
    : "0 2px 6px rgba(0,0,0,0.25)";      // placed

  function onPointerDown(e) {
    // left mouse button only
    if (e.button !== 0) return;

    dragging = true;
    z = nextZ();

    offsetX = e.clientX - x;
    offsetY = e.clientY - y;

    if (container?.setPointerCapture) {
      container.setPointerCapture(e.pointerId);
    }
  }

  function onPointerMove(e) {
    if (!dragging) return;

    x = e.clientX - offsetX;
    y = e.clientY - offsetY;
  }

  function onPointerUp(e) {
    if (!dragging) return;

    dragging = false;
    if (container?.releasePointerCapture) {
      container.releasePointerCapture(e.pointerId);
    }
  }

  function flipCard() {
    if (dragging) return;
    flipped = !flipped;
  }
</script>

<!-- OUTER: handles dragging, position, right-click flip -->
<div
  class="card-container"
  bind:this={container}
  style="transform: translate({x}px, {y}px) rotate({rotation}deg); z-index: {z};"
  on:pointerdown={onPointerDown}
  on:pointermove={onPointerMove}
  on:pointerup={onPointerUp}
  on:pointercancel={onPointerUp}
  on:contextmenu|preventDefault={flipCard}
>
  <!-- INNER: 3D flip -->
  <div class="card-inner" class:flipped={flipped}>
    <!-- FRONT -->
    <div
      class="card-face front"
      style="background: {card.color}; box-shadow: {shadow}"
    >
      <h3>{card.name}</h3>
      <p>Cost: {card.cost}</p>
    </div>

    <!-- BACK -->
    <div class="card-face back">
      <p>Card Back</p>
    </div>
  </div>
</div>

<style>
  .card-container {
    position: absolute;
    width: 120px;
    height: 160px;
    perspective: 600px;
    user-select: none;
    cursor: grab;
  }

  .card-inner {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.35s ease;
  }

  .card-inner.flipped {
    transform: rotateY(180deg);
  }

  .card-face {
    position: absolute;
    backface-visibility: hidden;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    padding: 8px;
    transition: box-shadow 0.12s ease;
		border: 2px solid black;
  }

  .back {
    background: #333;
    color: white;
    transform: rotateY(180deg);
    display: flex;
    align-items: center;
    justify-content: center;
		border: 2px solid black;
  }
</style>

