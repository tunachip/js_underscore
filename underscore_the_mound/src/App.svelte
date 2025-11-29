<script>
  import { onMount } from "svelte";
  import Card from "./lib/Card.svelte";

  const colors = [
		"red",
		"blue",
	];

  // Simple Fisher–Yates shuffle
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  let cards = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    name: `Card ${i + 1}`,
    cost: (i % 3) + 1,
    color: colors[i % colors.length],
  }));
	

  cards = shuffle(cards);


  // board / hand layout
  let boardWidth = 1000;     // default, updated on mount
  const handY = 100;         // vertical position for the row of cards

  onMount(() => {
    // use the actual viewport width once we're on the client
    boardWidth = window.innerWidth || boardWidth;
  });

  // spread cards evenly across the width with some side padding
  function cardPosition(index, total) {
    if (total <= 1) {
      return { x: boardWidth / 2, y: handY };
    }

    const padding = 0; // px from each side
    const usableWidth = boardWidth - padding ;
    const step = usableWidth / (total - 1);
    const x = padding + step * index;

    return { x, y: handY };
  }
</script>

<main>
  <div class="grid">
    {#each colors as c}
      <div class="region" style="background-color: {c};"></div>
    {/each}
  </div>

  {#each cards as card, i (card.id)}
    {@const pos = cardPosition(i, cards.length)}
    <Card
      card={card}
      startFaceDown={true}
      initialX={pos.x}
      initialY={pos.y}
      initialAngle={0}
    />
  {/each}
</main>

<style>
  .grid {
    display: grid;
    gap: 12px;
		width: 100%;
		border: 12px solid black;
		background: #000000;
  }

  .region {
    aspect-ratio: 4 / 1;
    width: 100%;
    border-radius: 6px;
  }

  main {
    width: 100vw;
    height: 100vh;
    position: relative;
    background: #aaaaaa;
  }
</style>

