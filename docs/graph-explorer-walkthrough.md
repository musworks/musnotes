# Graph Explorer Walkthrough

This note documents the Obsidian-style Graph View and Local Graph improvements in the Hugo graph explorer. The implementation stays fully vanilla JavaScript and CSS, and it keeps the existing botanical/editorial visual language intact.

## Scope

The work is split across three files:

- `layouts/graph/section.html`
- `assets/css/extended/graph.css`
- `assets/js/graph-view-v2.js`

## Template changes

The graph template now exposes the UI hooks needed for local graph behavior and for localized inspector copy.

- The inspector action row now contains both the reset control and the new local view control.
- The local toggle is rendered with `data-graph-local-toggle`.
- The reset label, focus copy, and hint text remain localized for English and Indonesian.

Relevant markup:

- `layouts/graph/section.html:66`
- `layouts/graph/section.html:98`

## Styling changes

The new control lives inside a shared action container so the inspector can hold multiple compact controls without breaking the existing layout.

- `.graph-inspector__actions` lays out the reset and local-view controls in one row.
- `.graph-inspector__local-toggle` has default, hover, focus, active, and dark-theme states.
- The active state uses the same soft editorial treatment as the rest of the explorer controls instead of introducing a new visual language.

Relevant styles:

- `assets/css/extended/graph.css:444`
- `assets/css/extended/graph.css:452`
- `assets/css/extended/graph.css:478`
- `assets/css/extended/graph.css:583`
- `assets/css/extended/graph.css:600`

## Runtime and rendering changes

### 1. Simulation space and movement

The layout simulation is no longer tied to viewport dimensions. Nodes now live in a virtual world centered around `(0, 0)`, while the camera handles screen projection.

- Zoom range is widened to `0.15` through `6.0`.
- Node positions are clamped into a stable world range during integration.
- Dragging updates the node position immediately on `pointermove`, which removes the old one-frame latency/jitter feel.

Relevant code:

- `assets/js/graph-view-v2.js:66`
- `assets/js/graph-view-v2.js:551`
- `assets/js/graph-view-v2.js:1046`

### 2. Collision handling

A fast collision pass now runs after integration so dense areas stay readable and nodes do not collapse into each other.

- The pass uses radius-aware separation with extra padding.
- The push strength respects current simulation energy so movement stays soft instead of explosive.

Relevant code:

- `assets/js/graph-view-v2.js:567`

### 3. Camera behavior

The camera now behaves more like a graph explorer than a fixed canvas.

- Wheel zoom is cursor-centered.
- Fit view restores the whole graph.
- Local view can fit just the focused node plus its immediate neighborhood.

Relevant code:

- `assets/js/graph-view-v2.js:592`
- `assets/js/graph-view-v2.js:962`
- `assets/js/graph-view-v2.js:1098`

### 4. Edge rendering optimization

Edges are now rendered as straight lines and grouped into a small set of style batches before drawing.

- This replaces per-edge stroke calls with grouped path strokes.
- The batches separate `category` links and normal versus highlighted states. Tags are retained as front matter metadata but are intentionally absent from the graph.
- On dense graphs, this sharply reduces canvas path work and draw-call overhead.

Relevant code:

- `assets/js/graph-view-v2.js:695`

### 5. Coordinate caching

Each frame now precomputes projected screen coordinates and visibility once per visible node.

- `screenX`, `screenY`, and `onScreen` are cached in `draw()`.
- Edge rendering, label decisions, and node drawing reuse the cached values instead of recomputing projections repeatedly.

Relevant code:

- `assets/js/graph-view-v2.js:934`

### 6. Focus and hover fading

Focused and hovered neighborhoods now fade the rest of the graph to a consistent low-opacity background.

- Non-neighbor nodes and edges fade to `0.08`.
- Hover and focus share the same soft isolation model, which keeps the graph readable without fully hiding context.

Relevant code:

- `assets/js/graph-view-v2.js:64`
- `assets/js/graph-view-v2.js:65`
- `assets/js/graph-view-v2.js:682`
- `assets/js/graph-view-v2.js:741`

### 7. Node halos and emphasis

Focused and hovered nodes now get a layered glow treatment, while neighboring nodes receive a lighter ring.

- Active nodes use two glow layers for stronger visual priority.
- Neighbor nodes use a single halo so relationships remain legible without competing with the selected node.

Relevant code:

- `assets/js/graph-view-v2.js:836`

### 8. Zoom-aware label density

Label visibility now follows explicit zoom thresholds instead of one static rule.

- Below `0.6`, only category labels stay ambient unless a node is focused, hovered, or directly adjacent.
- Below `1.0`, category labels remain available, but post labels stay hidden unless directly active.
- At `1.0` and above, normal degree-based label logic resumes.
- Bounding-box collision checks still suppress overlapping low-priority labels.

Relevant code:

- `assets/js/graph-view-v2.js:765`
- `assets/js/graph-view-v2.js:884`

## Interaction model

### Focus

Single-click focuses a node, updates the inspector, and fades unrelated nodes into the background.

- Clicking blank space clears focus.
- Reset focus also clears local view and restores the fitted global camera.

Relevant code:

- `assets/js/graph-view-v2.js:448`
- `assets/js/graph-view-v2.js:1007`
- `assets/js/graph-view-v2.js:1108`

### Local View

Local View is only available when a node is focused.

- Toggling it filters drawing to the focused node and its immediate neighbors.
- The camera re-fits around that neighborhood for a local-graph effect.
- If the user clicks a connected neighbor while local view is active, focus shifts and the neighborhood fit updates around the new node.

Relevant code:

- `assets/js/graph-view-v2.js:318`
- `assets/js/graph-view-v2.js:592`
- `assets/js/graph-view-v2.js:702`
- `assets/js/graph-view-v2.js:854`
- `assets/js/graph-view-v2.js:1010`
- `assets/js/graph-view-v2.js:1118`

### Navigation

Double-clicking a post node opens the post immediately with `window.location.assign(...)`.

Relevant code:

- `assets/js/graph-view-v2.js:992`
- `assets/js/graph-view-v2.js:1095`

## Maintainer notes

- The graph still depends on lightweight canvas rendering and direct DOM event listeners, so there is no framework runtime cost.
- Local View currently means first-degree neighbors only. If a deeper traversal mode is ever added, the best extension point is the neighborhood filtering path rather than the inspector UI.
- The inspector, control labels, and helper copy are already localization-aware at the template layer, so future UI additions should follow the same `data-*` pattern.
