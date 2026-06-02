(() => {
    const root = document.getElementById("graph-explorer");
    if (!root) return;

    const canvas = root.querySelector("[data-graph-canvas]");
    const stage = canvas ? canvas.parentElement : null;
    const stats = root.querySelector("[data-graph-stats]");
    const emptyState = root.querySelector("[data-graph-empty]");
    const inspectorTitle = root.querySelector("[data-graph-title]");
    const inspectorCopy = root.querySelector("[data-graph-copy]");
    const inspectorFacts = root.querySelector("[data-graph-facts]");
    const inspectorLink = root.querySelector("[data-graph-link]");
    const filterButtons = Array.from(root.querySelectorAll("[data-filter]"));
    const graphUrl = root.dataset.graphUrl;

    if (!canvas || !stage || !graphUrl) return;

    const ctx = canvas.getContext("2d");
    const defaultTitle = root.dataset.defaultTitle || "Hover or click a node";
    const defaultCopy = root.dataset.defaultCopy || "";
    const openLabel = root.dataset.openLabel || "Open";
    const loadingLabel = root.dataset.loadingLabel || "Loading...";
    const errorLabel = root.dataset.errorLabel || "Unable to load graph.";
    const emptyLabel = root.dataset.emptyLabel || "No nodes available.";
    const statsTemplate = root.dataset.statsTemplate || "{nodes} nodes - {links} links";
    const typeLabels = {
        post: root.dataset.typePost || "Post",
        tag: root.dataset.typeTag || "Tag",
        category: root.dataset.typeCategory || "Category"
    };
    const factLabels = {
        type: root.dataset.labelType || "Type",
        relations: root.dataset.labelRelations || "Relations",
        section: root.dataset.labelSection || "Section",
        date: root.dataset.labelDate || "Date"
    };
    const copyByKind = {
        post: root.dataset.copyPost || "This post connects to the tags and categories that shape its context.",
        tag: root.dataset.copyTag || "This tag ties together posts growing around a shared theme.",
        category: root.dataset.copyCategory || "This category gathers a broader branch of related writing."
    };

    const state = {
        width: 0,
        height: 0,
        alpha: 0,
        activeFilter: "all",
        rawNodes: [],
        rawLinks: [],
        visibleNodes: [],
        visibleLinks: [],
        nodeMap: new Map(),
        degrees: new Map(),
        adjacency: new Map(),
        hoveredNode: null,
        selectedNode: null,
        draggingNode: null,
        pointer: { x: 0, y: 0 },
        frame: 0
    };

    const kindRadius = {
        post: 4.2,
        tag: 6.6,
        category: 8.2
    };

    function css(name, fallback) {
        const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        return value || fallback;
    }

    function hash(value) {
        let result = 0;
        for (let index = 0; index < value.length; index += 1) {
            result = ((result << 5) - result + value.charCodeAt(index)) | 0;
        }
        return Math.abs(result);
    }

    function seeded(value) {
        return (hash(value) % 10000) / 10000;
    }

    function anchorFor(kind) {
        if (kind === "tag") {
            return { x: state.width * 0.7, y: state.height * 0.32, spreadX: state.width * 0.2, spreadY: state.height * 0.22 };
        }
        if (kind === "category") {
            return { x: state.width * 0.68, y: state.height * 0.76, spreadX: state.width * 0.19, spreadY: state.height * 0.16 };
        }
        return { x: state.width * 0.35, y: state.height * 0.56, spreadX: state.width * 0.34, spreadY: state.height * 0.31 };
    }

    function initializeNode(node) {
        const anchor = anchorFor(node.kind);
        node.x = anchor.x + (seeded(node.id) - 0.5) * anchor.spreadX;
        node.y = anchor.y + (seeded(`${node.id}:y`) - 0.5) * anchor.spreadY;
        node.vx = 0;
        node.vy = 0;
    }

    function degreeMap(nodes, links) {
        const map = new Map(nodes.map((node) => [node.id, 0]));
        links.forEach((link) => {
            map.set(link.source, (map.get(link.source) || 0) + 1);
            map.set(link.target, (map.get(link.target) || 0) + 1);
        });
        return map;
    }

    function adjacencyMap(nodes, links) {
        const map = new Map(nodes.map((node) => [node.id, new Set()]));
        links.forEach((link) => {
            if (!map.has(link.source) || !map.has(link.target)) return;
            map.get(link.source).add(link.target);
            map.get(link.target).add(link.source);
        });
        return map;
    }

    function updateCanvasSize() {
        const rect = stage.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        state.width = Math.max(rect.width, 280);
        state.height = Math.max(rect.height, 320);
        canvas.width = Math.floor(state.width * dpr);
        canvas.height = Math.floor(state.height * dpr);
        canvas.style.width = `${state.width}px`;
        canvas.style.height = `${state.height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function activeNode() {
        return state.hoveredNode || state.selectedNode;
    }

    function updateInspector() {
        const target = activeNode();
        inspectorTitle.textContent = target ? target.label : defaultTitle;
        inspectorCopy.textContent = target ? (copyByKind[target.kind] || defaultCopy) : defaultCopy;
        inspectorFacts.innerHTML = "";

        if (!target) {
            inspectorLink.hidden = true;
            inspectorLink.removeAttribute("href");
            return;
        }

        const facts = [
            [factLabels.type, typeLabels[target.kind] || target.kind],
            [factLabels.relations, String(state.degrees.get(target.id) || 0)]
        ];

        if (target.section) facts.splice(1, 0, [factLabels.section, target.section]);
        if (target.date) facts.push([factLabels.date, target.date]);

        facts.forEach(([label, value]) => {
            const dt = document.createElement("dt");
            dt.textContent = label;
            const dd = document.createElement("dd");
            dd.textContent = value;
            inspectorFacts.append(dt, dd);
        });

        if (target.url) {
            inspectorLink.hidden = false;
            inspectorLink.href = target.url;
            inspectorLink.textContent = openLabel;
        } else {
            inspectorLink.hidden = true;
            inspectorLink.removeAttribute("href");
        }
    }

    function applyFilter() {
        const filters = {
            all: (node) => true,
            tags: (node) => node.kind === "tag",
            categories: (node) => node.kind === "category",
            "posts-tags": (node) => node.kind === "post" || node.kind === "tag"
        };

        const matcher = filters[state.activeFilter] || filters.all;
        state.visibleNodes = state.rawNodes.filter((node) => matcher(node));
        const visibleIds = new Set(state.visibleNodes.map((node) => node.id));
        state.visibleLinks = state.rawLinks.filter((link) => visibleIds.has(link.source) && visibleIds.has(link.target));
        state.degrees = degreeMap(state.visibleNodes, state.visibleLinks);
        state.adjacency = adjacencyMap(state.visibleNodes, state.visibleLinks);

        if (state.selectedNode && !visibleIds.has(state.selectedNode.id)) {
            state.selectedNode = null;
        }
        state.hoveredNode = null;

        if (state.visibleNodes.length === 0) {
            emptyState.hidden = false;
            emptyState.textContent = emptyLabel;
        } else {
            emptyState.hidden = true;
            emptyState.textContent = "";
        }

        stats.textContent = statsTemplate
            .replace("{nodes}", String(state.visibleNodes.length))
            .replace("{links}", String(state.visibleLinks.length));

        state.alpha = 1;
        updateInspector();
        requestFrame();
    }

    function pointerPosition(event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    function radiusFor(node) {
        return kindRadius[node.kind] + Math.min((state.degrees.get(node.id) || 0) * 0.1, 1.8);
    }

    function nearestNode(x, y) {
        let best = null;
        let bestDistance = Infinity;
        state.visibleNodes.forEach((node) => {
            const dx = node.x - x;
            const dy = node.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < radiusFor(node) + 10 && distance < bestDistance) {
                best = node;
                bestDistance = distance;
            }
        });
        return best;
    }

    function nodePalette(kind) {
        if (kind === "tag") {
            return {
                fill: css("--graph-tag-fill", "#7f9f82"),
                stroke: css("--graph-tag-stroke", "#65816b"),
                label: css("--graph-tag-label", "#4d6552")
            };
        }
        if (kind === "category") {
            return {
                fill: css("--graph-category-fill", "#9d768d"),
                stroke: css("--graph-category-stroke", "#815f74"),
                label: css("--graph-category-label", "#7b5568")
            };
        }
        return {
            fill: css("--graph-post-fill", "#6f7678"),
            stroke: css("--graph-post-stroke", "#596264"),
            label: css("--graph-post-label", "#374042")
        };
    }

    function labelStyle(node, highlighted, emphasized) {
        const degree = state.degrees.get(node.id) || 0;
        const alwaysShow = node.kind === "category"
            || (node.kind === "tag" && degree >= 2)
            || (node.kind === "post" && degree >= 6);
        const show = alwaysShow || highlighted || emphasized;

        if (!show) return null;

        const palette = nodePalette(node.kind);
        return {
            font: emphasized
                ? "600 13px Alice, Georgia, serif"
                : highlighted
                    ? "600 12px Alice, Georgia, serif"
                    : node.kind === "category"
                        ? "600 12px Alice, Georgia, serif"
                        : alwaysShow
                            ? "500 11.5px Alice, Georgia, serif"
                            : "400 11px Alice, Georgia, serif",
            color: emphasized || highlighted
                ? css("--graph-label-strong", palette.label)
                : alwaysShow
                    ? palette.label
                    : css("--graph-label-muted", palette.label),
            align: node.kind === "post" ? "left" : (node.x < state.width * 0.5 ? "left" : "right"),
            offsetX: node.kind === "post" ? 11 : (node.x < state.width * 0.5 ? 11 : -11),
            offsetY: emphasized ? -13 : -11,
            alpha: emphasized || highlighted ? 1 : alwaysShow ? 0.96 : 0.7
        };
    }

    function drawLabel(node, style, faded) {
        if (!style) return;
        ctx.save();
        ctx.globalAlpha = faded ? style.alpha * 0.52 : style.alpha;
        ctx.font = style.font;
        ctx.textAlign = style.align;
        ctx.textBaseline = "middle";
        ctx.lineWidth = 4;
        ctx.strokeStyle = css("--graph-label-stroke", "rgba(252, 248, 242, 0.92)");
        ctx.strokeText(node.label, node.x + style.offsetX, node.y + style.offsetY);
        ctx.fillStyle = style.color;
        ctx.fillText(node.label, node.x + style.offsetX, node.y + style.offsetY);
        ctx.restore();
    }

    function draw() {
        ctx.clearRect(0, 0, state.width, state.height);

        const focus = activeNode();
        const focusId = focus ? focus.id : null;
        const neighborIds = focusId ? (state.adjacency.get(focusId) || new Set()) : new Set();

        state.visibleLinks.forEach((link) => {
            const source = state.nodeMap.get(link.source);
            const target = state.nodeMap.get(link.target);
            if (!source || !target) return;

            const isFocused = focusId && (source.id === focusId || target.id === focusId);
            const isNeighborLink = !isFocused && focusId && neighborIds.has(source.id) && neighborIds.has(target.id);
            const faded = focusId && !isFocused && !isNeighborLink;

            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = link.kind === "category"
                ? css("--graph-link-category", "rgba(132, 96, 118, 0.4)")
                : css("--graph-link-tag", "rgba(111, 145, 113, 0.42)");
            ctx.globalAlpha = faded ? 0.18 : isFocused ? 0.95 : isNeighborLink ? 0.64 : 0.58;
            ctx.lineWidth = isFocused ? (link.kind === "category" ? 2.2 : 2) : isNeighborLink ? 1.55 : (link.kind === "category" ? 1.35 : 1.18);
            ctx.moveTo(source.x, source.y);
            ctx.quadraticCurveTo(
                (source.x + target.x) * 0.5,
                (source.y + target.y) * 0.5 + (source.kind === "post" ? 7 : -7),
                target.x,
                target.y
            );
            ctx.stroke();
            ctx.restore();
        });

        state.visibleNodes.forEach((node) => {
            const palette = nodePalette(node.kind);
            const isHovered = Boolean(state.hoveredNode && state.hoveredNode.id === node.id);
            const isSelected = Boolean(state.selectedNode && state.selectedNode.id === node.id);
            const isFocused = isHovered || isSelected;
            const isNeighbor = focusId ? neighborIds.has(node.id) : false;
            const faded = focusId && !isFocused && !isNeighbor;
            const radius = radiusFor(node);
            const scale = isHovered ? 1.18 : isSelected ? 1.12 : isNeighbor ? 1.05 : 1;
            const drawRadius = radius * scale;

            ctx.save();
            ctx.globalAlpha = faded ? 0.4 : 1;

            if (isFocused || isNeighbor) {
                ctx.beginPath();
                ctx.fillStyle = isFocused
                    ? (isHovered ? css("--graph-node-hover", "rgba(87, 117, 98, 0.22)") : css("--graph-node-selected", "rgba(126, 91, 114, 0.2)"))
                    : css("--graph-node-neighbor", "rgba(87, 117, 98, 0.13)");
                ctx.arc(node.x, node.y, drawRadius + (isFocused ? 8.5 : 6), 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.beginPath();
            ctx.fillStyle = palette.fill;
            ctx.strokeStyle = isFocused
                ? css("--graph-node-outline-strong", "rgba(43, 46, 49, 0.85)")
                : isNeighbor
                    ? css("--graph-node-outline-medium", "rgba(43, 46, 49, 0.48)")
                    : palette.stroke;
            ctx.lineWidth = isFocused ? 2.2 : isNeighbor ? 1.45 : 1.15;
            ctx.arc(node.x, node.y, drawRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            drawLabel(node, labelStyle(node, isHovered || isNeighbor, isSelected), faded);
        });
    }

    function stepSimulation() {
        if (state.visibleNodes.length === 0) return false;

        const nodes = state.visibleNodes;
        const links = state.visibleLinks;

        nodes.forEach((node) => {
            const anchor = anchorFor(node.kind);
            const pull = node.kind === "post" ? 0.00085 : 0.00125;
            node.vx += (anchor.x - node.x) * pull * state.alpha;
            node.vy += (anchor.y - node.y) * pull * state.alpha;
        });

        for (let i = 0; i < nodes.length; i += 1) {
            const nodeA = nodes[i];
            for (let j = i + 1; j < nodes.length; j += 1) {
                const nodeB = nodes[j];
                const dx = nodeB.x - nodeA.x;
                const dy = nodeB.y - nodeA.y;
                const distanceSquared = Math.max(dx * dx + dy * dy, 36);
                const distance = Math.sqrt(distanceSquared);
                const repulsion = (nodeA.kind === "post" && nodeB.kind === "post" ? 42 : 62) / distanceSquared;
                const pushX = (dx / distance) * repulsion * 12 * state.alpha;
                const pushY = (dy / distance) * repulsion * 12 * state.alpha;
                nodeA.vx -= pushX;
                nodeA.vy -= pushY;
                nodeB.vx += pushX;
                nodeB.vy += pushY;
            }
        }

        links.forEach((link) => {
            const source = state.nodeMap.get(link.source);
            const target = state.nodeMap.get(link.target);
            if (!source || !target) return;
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
            const desired = link.kind === "category" ? 76 : 68;
            const force = (distance - desired) * 0.0019 * state.alpha;
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;
            source.vx += fx;
            source.vy += fy;
            target.vx -= fx;
            target.vy -= fy;
        });

        nodes.forEach((node) => {
            if (state.draggingNode && state.draggingNode.id === node.id) {
                node.x = state.pointer.x;
                node.y = state.pointer.y;
                node.vx = 0;
                node.vy = 0;
                return;
            }

            node.vx *= 0.9;
            node.vy *= 0.9;
            node.x += node.vx;
            node.y += node.vy;

            const padding = 24;
            node.x = Math.max(padding, Math.min(state.width - padding, node.x));
            node.y = Math.max(padding, Math.min(state.height - padding, node.y));
        });

        state.alpha = Math.max(0, state.alpha * 0.992);
        return Boolean(state.draggingNode) || state.alpha > 0.035;
    }

    function requestFrame() {
        if (!state.frame) {
            state.frame = window.requestAnimationFrame(tick);
        }
    }

    function tick() {
        state.frame = 0;
        const shouldContinue = stepSimulation();
        draw();
        if (shouldContinue) requestFrame();
    }

    function openNode(node) {
        if (node && node.url) {
            window.location.href = node.url;
        }
    }

    function refreshHover(event) {
        state.pointer = pointerPosition(event);
        const nextNode = nearestNode(state.pointer.x, state.pointer.y);
        if (nextNode !== state.hoveredNode) {
            state.hoveredNode = nextNode;
            updateInspector();
            draw();
        }
        canvas.style.cursor = state.draggingNode ? "grabbing" : nextNode ? "pointer" : "default";
    }

    function attachEvents() {
        canvas.addEventListener("mousemove", (event) => {
            refreshHover(event);
            if (state.draggingNode) {
                state.alpha = Math.max(state.alpha, 0.22);
                requestFrame();
            }
        });

        canvas.addEventListener("mouseleave", () => {
            state.hoveredNode = null;
            if (!state.draggingNode) {
                canvas.style.cursor = "default";
            }
            updateInspector();
            draw();
        });

        canvas.addEventListener("mousedown", (event) => {
            state.pointer = pointerPosition(event);
            const node = nearestNode(state.pointer.x, state.pointer.y);
            if (!node) return;
            state.draggingNode = node;
            state.selectedNode = node;
            state.alpha = 0.9;
            canvas.style.cursor = "grabbing";
            updateInspector();
            requestFrame();
        });

        window.addEventListener("mouseup", () => {
            if (!state.draggingNode) return;
            state.draggingNode = null;
            state.alpha = Math.max(state.alpha, 0.12);
            canvas.style.cursor = state.hoveredNode ? "pointer" : "default";
            requestFrame();
        });

        canvas.addEventListener("click", (event) => {
            const point = pointerPosition(event);
            const node = nearestNode(point.x, point.y);
            state.selectedNode = node || null;
            if (!node) {
                state.hoveredNode = null;
                canvas.style.cursor = "default";
            }
            updateInspector();
            draw();
        });

        canvas.addEventListener("dblclick", (event) => {
            const point = pointerPosition(event);
            openNode(nearestNode(point.x, point.y));
        });

        filterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                state.activeFilter = button.dataset.filter || "all";
                filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
                applyFilter();
            });
        });

        const resizeObserver = new ResizeObserver(() => {
            updateCanvasSize();
            state.rawNodes.forEach((node) => {
                if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) initializeNode(node);
            });
            state.alpha = Math.max(state.alpha, 0.7);
            requestFrame();
        });
        resizeObserver.observe(stage);
    }

    async function bootstrap() {
        try {
            stats.textContent = loadingLabel;
            const response = await fetch(graphUrl, { credentials: "same-origin" });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const payload = await response.json();

            state.rawNodes = (payload.nodes || []).map((node) => ({ ...node }));
            state.rawLinks = payload.links || [];
            state.nodeMap = new Map(state.rawNodes.map((node) => [node.id, node]));

            updateCanvasSize();
            state.rawNodes.forEach((node) => initializeNode(node));
            attachEvents();
            applyFilter();
            updateInspector();
            draw();
            requestFrame();
        } catch (error) {
            stats.textContent = errorLabel;
            emptyState.hidden = false;
            emptyState.textContent = errorLabel;
        }
    }

    bootstrap();
})();
