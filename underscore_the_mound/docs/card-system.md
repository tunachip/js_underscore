# Card Playground Reference

This repo now includes a miniature card sandbox showing a variety of common UI patterns: drag targets that glow, different slot behaviors, stacking visuals, and player-visibility rules. Everything is written in Svelte with inline comments so you can learn by reading the source.

## Key components

- `src/lib/Card.svelte`  
  Handles drag/flip, dynamic shadows that scale with stack offset, optional hover-peek for face-down cards you control. Emits `dragstart`, `dragmove`, `drop`, and `flip` so parents own the rules.
- `src/lib/Region.svelte`  
  Simple drop target that brightens while a card is held over it and reports hover to `dragState`. Used by `Slot` for the “region” requirement.
- `src/lib/Slot.svelte`  
  A framed slot/tray that can stack cards. Supports multiple interaction styles (peek tooltip, spread-on-hover with cycle via right-click or scroll, top-card pop, hand rows). Emits `drop`, `flip`, and `cycle`.
- `src/lib/SlotBox.svelte`  
  Utility to lay out a grid of slots (x by y) inside a framed tray.
- `src/lib/dragState.js`  
  Shared stores (`draggingCardId`, `hoveredSlotId`, `originSlotId`) so slots and cards can coordinate drag-hover state.

## Slot types implemented

- Deck piles: unlimited stack, small offset, hover tooltip; right-click or scroll cycles top to bottom.
- Limited stacks: larger offset and `capacity` gates (see play slots 3–4).
- Single-card slot: `capacity: 1` (play slot 5).
- Hand tray: “single-slot tray” that is 7-cards wide, offsets horizontally, and lets you grab cards from anywhere in the row.
- Region demo: two neutral slots (`region-a`, `region-b`) that glow on hover while dragging and accept drops from either player.

## Hover behaviors

- Peek count (deck + discard): hover shows “Stack: N”.
- Spread + cycle (decks/discards): hover increases offset; right-click or scroll moves top -> bottom.
- Top-pop (play slots 3–4): only top card lifts on hover; click flips it face-up; right-click cycles if enabled.
- Hand tray: hover lifts every card slightly; clicking a card starts a drag (normal pointer-down).
- Discard cycling: scroll on discard piles rotates the order; works for both players.

## Card state rules

States are applied based on the last slot touched:

- `in-deck`: right-click cannot flip face-up.
- `in-hand`: right-click cannot flip face-down.
- `in-play`: can flip either way.
- `other-owner`: cannot drag or flip, but other cards can be stacked onto it.

`src/App.svelte` enforces these in `handleFlip` and `canDrop`.

## Visibility and control

- Toggle which player you control via the header button.
- When you control a player you see their hand + discard face-up and can hover your own face-down play cards to peek (via `peekable`).
- Opponent cards: only face-up cards in play and discard are visible; no hover-peek on their face-down cards.
- You can play your cards onto the opponent’s trays only if stacking onto an existing card.

## Board layout

- Two of each tray per player: deck, hand, play (5 slots via `SlotBox`), discard.
- Region demo row shows glowing drop targets.
- Drop shadows scale with stack offset and max out while dragging to sell a simple 3D illusion.

## How to explore

1. Run `npm run dev` then open the app.
2. Drag cards between trays; notice glow on drop regions.
3. Hover decks/discards to see counts, scroll/right-click to cycle.
4. Hover play slots 3–4 to pop the top card; click to flip.
5. Switch control to see visibility rules change; try playing onto the opponent’s slot only when a card already exists there.

Read through `App.svelte`, `Slot.svelte`, and `Card.svelte`—they’re heavily commented for learning the patterns.
