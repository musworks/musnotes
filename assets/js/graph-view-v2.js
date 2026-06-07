(() => {
    const root = document.getElementById("graph-explorer");
    if (!root) return;
    if (root.dataset.graphInteractiveBound === "true") return;
    root.dataset.graphInteractiveBound = "true";

    const canvas = root.querySelector("[data-graph-canvas]");
    const stage = canvas ? canvas.parentElement : null;
    const stats = root.querySelector("[data-graph-stats]");
    const emptyState = root.querySelector("[data-graph-empty]");
    const inspectorTitle = root.querySelector("[data-graph-title]");
    const inspectorCopy = root.querySelector("[data-graph-copy]");
    const inspectorFacts = root.querySelector("[data-graph-facts]");
    const inspectorLink = root.querySelector("[data-graph-link]");
    const inspectorStatus = root.querySelector("[data-graph-status]");
    const inspectorReset = root.querySelector("[data-graph-reset]");
    const localToggle = root.querySelector("[data-graph-local-toggle]");
    const relatedWrap = root.querySelector("[data-graph-related-wrap]");
    const relatedList = root.querySelector("[data-graph-related]");
    const relatedLabelNode = relatedWrap ? relatedWrap.querySelector(".graph-inspector__related-label") : null;
    const filterButtons = Array.from(root.querySelectorAll("[data-filter]"));
    const viewButtons = Array.from(root.querySelectorAll("[data-graph-action]"));
    const graphUrl = root.dataset.graphUrl;

    if (!canvas || !stage || !graphUrl) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const DEBUG = Boolean(window.__GRAPH_DEBUG__ || root.dataset.graphDebug === "true");

    const defaultTitle = root.dataset.defaultTitle || "Hover or click a node";
    const defaultCopy = root.dataset.defaultCopy || "";
    const openLabel = root.dataset.openLabel || "Open";
    const loadingLabel = root.dataset.loadingLabel || "Loading...";
    const errorLabel = root.dataset.errorLabel || "Unable to load graph.";
    const emptyLabel = root.dataset.emptyLabel || "No nodes available.";
    const statsTemplate = root.dataset.statsTemplate || "{nodes} nodes - {links} links";
    const idleStateLabel = root.dataset.idleState || "No focus yet";
    const hoverStateLabel = root.dataset.hoverState || "Preview";
    const selectedStateLabel = root.dataset.selectedState || "Selected";
    const resetLabel = root.dataset.resetLabel || "Reset focus";
    const typeLabels = {
        post: root.dataset.typePost || "Post",
        tag: root.dataset.typeTag || "Tag",
        category: root.dataset.typeCategory || "Category"
    };
    const connectionLabel = root.dataset.labelRelated || "Connected";

    function debugLog(...parts) {
        if (!DEBUG) return;
        console.log("[graph]", ...parts);
    }

    const config = {
        nodeRadius: { post: 5.6, tag: 8.3, category: 10.4 },
        degreeBoost: { post: 0.22, tag: 0.3, category: 0.34 },
        maxRadiusBoost: 5.2,
        pickPadding: 12,
        worldPadding: 46,
        focusFade: 0.08,
        hoverFade: 0.08,
        view: { minScale: 0.15, maxScale: 6.0, fitPadding: 56 },
        force: {
            repulsionSame: 52,
            repulsionCross: 82,
            repulsionStrength: 15,
            linkDistance: { tag: 96, category: 118 },
            linkStrength: 0.0032,
            anchorPull: { post: 0.00105, tag: 0.00142, category: 0.00178 },
            centerPull: 0.00052,
            damping: 0.9,
            alphaDecay: 0.985,
            settleFloor: 0.02,
            prewarm: 160
        },
        labels: {
            thresholds: { post: 6, tag: 4, category: 2 },
            importantQuota: 12,
            maxAmbientDesktop: 16,
            maxAmbientMobile: 8
        },
        relatedLimit: 10
    };

    const state = {
        width: 0,
        height: 0,
        dpr: 1,
        alpha: 0,
        frame: 0,
        activeFilter: "all",
        rawNodes: [],
        rawLinks: [],
        nodeMap: new Map(),
        visibleNodes: [],
        visibleLinks: [],
        visibleNodeIds: new Set(),
        degrees: new Map(),
        adjacency: new Map(),
        incidentLinks: new Map(),
        ambientLabelIds: new Set(),
        focusNode: null,
        hoverNode: null,
        draggingNode: null,
        panning: false,
        pointerDown: false,
        pointerMoved: false,
        pointerId: null,
        pointerScreen: { x: 0, y: 0 },
        dragStartScreen: { x: 0, y: 0 },
        dragStartView: { x: 0, y: 0 },
        dragOriginNode: null,
        view: { x: 0, y: 0, scale: 1 },
        userMovedView: false,
        localViewActive: false,
        eventsBound: false,
        resizeObserver: null,
        activePointers: new Map(),
        pinchGesture: null,
        lastHitNodeId: null
    };

    function describeNode(node) {
        if (!node) return null;
        return {
            id: node.id,
            kind: node.kind,
            label: node.label,
            url: node.url || null
        };
    }

    function css(name, fallback) {
        const local = getComputedStyle(root).getPropertyValue(name).trim();
        const global = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        return local || global || fallback;
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
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

    function isMobileView() {
        return state.width > 0 && state.width < 720;
    }

    function scoreNode(node) {
        const degree = state.degrees.get(node.id) || 0;
        const kindWeight = node.kind === "category" ? 24 : node.kind === "tag" ? 14 : 8;
        return degree * 10 + kindWeight + (node.featured ? 18 : 0);
    }

    function anchorFor(kind) {
        if (kind === "category") return { x: 0, y: -60, spreadX: 180, spreadY: 120 };
        if (kind === "tag") return { x: 0, y: -20, spreadX: 360, spreadY: 240 };
        return { x: 0, y: 80, spreadX: 520, spreadY: 380 };
    }

    function initializeNode(node) {
        const anchor = anchorFor(node.kind);
        const angle = seeded(`${node.id}:angle`) * Math.PI * 2;
        const distance = 0.22 + Math.sqrt(seeded(`${node.id}:radius`)) * 0.78;
        node.x = anchor.x + Math.cos(angle) * anchor.spreadX * distance;
        node.y = anchor.y + Math.sin(angle) * anchor.spreadY * distance;
        node.vx = 0;
        node.vy = 0;
    }

    function ensureNodePositions(nodes) {
        nodes.forEach((node) => {
            if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) initializeNode(node);
            if (!Number.isFinite(node.vx)) node.vx = 0;
            if (!Number.isFinite(node.vy)) node.vy = 0;
        });
    }

    function updateCanvasSize() {
        const rect = stage.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        state.width = Math.max(rect.width, 280);
        state.height = Math.max(rect.height, 340);
        state.dpr = dpr;
        canvas.width = Math.floor(state.width * dpr);
        canvas.height = Math.floor(state.height * dpr);
        canvas.style.width = `${state.width}px`;
        canvas.style.height = `${state.height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        debugLog("canvas size", { width: state.width, height: state.height, dpr: state.dpr });
    }

    function pointerPosition(event) {
        const rect = canvas.getBoundingClientRect();
        return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }

    function screenToWorld(point) {
        return {
            x: (point.x - state.view.x) / state.view.scale,
            y: (point.y - state.view.y) / state.view.scale
        };
    }

    function worldToScreen(point) {
        return {
            x: point.x * state.view.scale + state.view.x,
            y: point.y * state.view.scale + state.view.y
        };
    }

    function viewCenter() {
        return {
            x: state.width * 0.5,
            y: state.height * 0.5
        };
    }

    function nodeRadius(node) {
        const base = config.nodeRadius[node.kind] || config.nodeRadius.post;
        const degree = state.degrees.get(node.id) || 0;
        const boost = Math.min(degree * (config.degreeBoost[node.kind] || config.degreeBoost.post), config.maxRadiusBoost);
        return base + boost;
    }

    function visibleScreen(node) {
        return node.onScreen ?? true;
    }

    function nearestNode(point) {
        const world = screenToWorld(point);
        let best = null;
        let bestDistance = Infinity;

        state.visibleNodes.forEach((node) => {
            const dx = node.x - world.x;
            const dy = node.y - world.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const hitRadius = nodeRadius(node) + config.pickPadding / state.view.scale;
            if (distance <= hitRadius && distance < bestDistance) {
                best = node;
                bestDistance = distance;
            }
        });

        return best;
    }

    function noteHit(node, source) {
        const hitId = node ? node.id : null;
        if (hitId && hitId !== state.lastHitNodeId) {
            debugLog("node hit detected", source, describeNode(node));
        }
        state.lastHitNodeId = hitId;
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
        const adjacency = new Map(nodes.map((node) => [node.id, new Set()]));
        const incident = new Map(nodes.map((node) => [node.id, []]));

        links.forEach((link) => {
            if (!adjacency.has(link.source) || !adjacency.has(link.target)) return;
            adjacency.get(link.source).add(link.target);
            adjacency.get(link.target).add(link.source);
            incident.get(link.source).push(link);
            incident.get(link.target).push(link);
        });

        state.incidentLinks = incident;
        return adjacency;
    }

    function relatedNodesFor(node) {
        if (!node) return [];

        const order = { category: 0, tag: 1, post: 2 };
        return Array.from(state.adjacency.get(node.id) || [])
            .map((id) => state.nodeMap.get(id))
            .filter(Boolean)
            .sort((nodeA, nodeB) => {
                const kindDiff = (order[nodeA.kind] ?? 9) - (order[nodeB.kind] ?? 9);
                if (kindDiff !== 0) return kindDiff;
                const degreeDiff = (state.degrees.get(nodeB.id) || 0) - (state.degrees.get(nodeA.id) || 0);
                if (degreeDiff !== 0) return degreeDiff;
                return nodeA.label.localeCompare(nodeB.label, undefined, { sensitivity: "base" });
            });
    }

    function activeNode() {
        return state.focusNode || state.hoverNode;
    }

    function neighborhoodSet(node) {
        if (!node) return new Set();
        const set = new Set([node.id]);
        const neighbors = state.adjacency.get(node.id) || new Set();
        neighbors.forEach((neighborId) => set.add(neighborId));
        return set;
    }

    function updateInspector() {
        const target = activeNode();
        if (inspectorTitle) {
            inspectorTitle.textContent = target ? target.label : defaultTitle;
        }

        if (inspectorStatus) {
            inspectorStatus.textContent = state.focusNode
                ? selectedStateLabel
                : state.hoverNode
                    ? hoverStateLabel
                    : idleStateLabel;
        }

        if (inspectorReset) {
            inspectorReset.hidden = !state.focusNode;
            inspectorReset.textContent = resetLabel;
        }

        if (localToggle) {
            localToggle.hidden = !state.focusNode;
            localToggle.classList.toggle("is-active", state.localViewActive && !!state.focusNode);
        }

        if (!target) {
            if (inspectorCopy) inspectorCopy.textContent = defaultCopy;
            if (inspectorLink) {
                inspectorLink.hidden = true;
                inspectorLink.removeAttribute("href");
            }
            return;
        }

        if (inspectorCopy) {
            const degree = state.degrees.get(target.id) || 0;
            const type = typeLabels[target.kind] || target.kind;
            inspectorCopy.textContent = `${type} - ${degree} ${connectionLabel.toLowerCase()}`;
        }

        if (inspectorLink) {
            if (state.focusNode && target.url) {
                inspectorLink.hidden = false;
                inspectorLink.href = target.url;
                inspectorLink.textContent = openLabel;
            } else {
                inspectorLink.hidden = true;
                inspectorLink.removeAttribute("href");
            }
        }
    }

    function updateStats() {
        if (!stats) return;
        stats.textContent = statsTemplate
            .replace("{nodes}", String(state.visibleNodes.length))
            .replace("{links}", String(state.visibleLinks.length));
    }

    function updateEmptyState() {
        if (!emptyState) return;
        if (state.visibleNodes.length === 0) {
            emptyState.hidden = false;
            emptyState.textContent = emptyLabel;
        } else {
            emptyState.hidden = true;
            emptyState.textContent = "";
        }
    }

    function rebuildAmbientLabels() {
        const threshold = config.labels.thresholds;
        const maxAmbient = isMobileView() ? config.labels.maxAmbientMobile : config.labels.maxAmbientDesktop;
        const candidates = state.visibleNodes
            .filter((node) => node.featured || (state.degrees.get(node.id) || 0) >= (threshold[node.kind] || threshold.post))
            .sort((nodeA, nodeB) => scoreNode(nodeB) - scoreNode(nodeA));

        const ambient = new Set();
        candidates.slice(0, config.labels.importantQuota).forEach((node) => ambient.add(node.id));
        candidates.slice(0, maxAmbient).forEach((node) => ambient.add(node.id));
        state.ambientLabelIds = ambient;
    }

    function fitViewToNodes() {
        if (state.visibleNodes.length === 0) return;

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        state.visibleNodes.forEach((node) => {
            const radius = nodeRadius(node);
            minX = Math.min(minX, node.x - radius);
            minY = Math.min(minY, node.y - radius);
            maxX = Math.max(maxX, node.x + radius);
            maxY = Math.max(maxY, node.y + radius);
        });

        const width = Math.max(maxX - minX, 1);
        const height = Math.max(maxY - minY, 1);
        const padding = config.view.fitPadding;
        const scaleX = (state.width - padding * 2) / width;
        const scaleY = (state.height - padding * 2) / height;
        const scale = clamp(Math.min(scaleX, scaleY, 1.18), config.view.minScale, config.view.maxScale);
        const centerX = (minX + maxX) * 0.5;
        const centerY = (minY + maxY) * 0.5;

        state.view.scale = scale;
        state.view.x = state.width * 0.5 - centerX * scale;
        state.view.y = state.height * 0.5 - centerY * scale;
    }

    function clearFocus() {
        state.focusNode = null;
        state.localViewActive = false;
        if (localToggle) {
            localToggle.classList.remove("is-active");
            localToggle.hidden = true;
        }
        updateInspector();
        draw();
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
        state.visibleNodeIds = new Set(state.visibleNodes.map((node) => node.id));
        state.visibleLinks = state.rawLinks.filter((link) => state.visibleNodeIds.has(link.source) && state.visibleNodeIds.has(link.target));
        state.degrees = degreeMap(state.visibleNodes, state.visibleLinks);
        state.adjacency = adjacencyMap(state.visibleNodes, state.visibleLinks);
        rebuildAmbientLabels();

        if (state.focusNode && !state.visibleNodeIds.has(state.focusNode.id)) state.focusNode = null;
        if (state.hoverNode && !state.visibleNodeIds.has(state.hoverNode.id)) state.hoverNode = null;
        if (state.draggingNode && !state.visibleNodeIds.has(state.draggingNode.id)) state.draggingNode = null;

        updateStats();
        updateEmptyState();
        updateInspector();

        state.userMovedView = false;
        fitViewToNodes();
        state.alpha = 1;
        requestFrame();
    }

    function applyAnchorForce(nodes) {
        nodes.forEach((node) => {
            const anchor = anchorFor(node.kind);
            const pull = config.force.anchorPull[node.kind] || config.force.anchorPull.post;
            node.vx += (anchor.x - node.x) * pull * state.alpha;
            node.vy += (anchor.y - node.y) * pull * state.alpha;
        });
    }

    function applyCenterForce(nodes) {
        nodes.forEach((node) => {
            node.vx += (0 - node.x) * config.force.centerPull * state.alpha;
            node.vy += (0 - node.y) * config.force.centerPull * state.alpha;
        });
    }

    function applyRepulsion(nodes) {
        for (let indexA = 0; indexA < nodes.length; indexA += 1) {
            const nodeA = nodes[indexA];
            for (let indexB = indexA + 1; indexB < nodes.length; indexB += 1) {
                const nodeB = nodes[indexB];
                const dx = nodeB.x - nodeA.x;
                const dy = nodeB.y - nodeA.y;
                const distanceSquared = Math.max(dx * dx + dy * dy, 48);
                const distance = Math.sqrt(distanceSquared);
                const base = nodeA.kind === nodeB.kind ? config.force.repulsionSame : config.force.repulsionCross;
                const repulsion = (base / distanceSquared) * config.force.repulsionStrength * state.alpha;
                const pushX = (dx / distance) * repulsion;
                const pushY = (dy / distance) * repulsion;
                nodeA.vx -= pushX;
                nodeA.vy -= pushY;
                nodeB.vx += pushX;
                nodeB.vy += pushY;
            }
        }
    }

    function applyLinkForce(links) {
        links.forEach((link) => {
            const source = state.nodeMap.get(link.source);
            const target = state.nodeMap.get(link.target);
            if (!source || !target || !state.visibleNodeIds.has(source.id) || !state.visibleNodeIds.has(target.id)) return;

            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
            const desired = link.kind === "category" ? config.force.linkDistance.category : config.force.linkDistance.tag;
            const spring = (distance - desired) * config.force.linkStrength * state.alpha;
            const fx = (dx / distance) * spring;
            const fy = (dy / distance) * spring;

            source.vx += fx;
            source.vy += fy;
            target.vx -= fx;
            target.vy -= fy;
        });
    }

    function integrate(nodes) {
        nodes.forEach((node) => {
            if (state.draggingNode && state.draggingNode.id === node.id) {
                const world = screenToWorld(state.pointerScreen);
                node.x = world.x;
                node.y = world.y;
                node.vx = 0;
                node.vy = 0;
                return;
            }

            node.vx *= config.force.damping;
            node.vy *= config.force.damping;
            node.x += node.vx;
            node.y += node.vy;
            node.x = clamp(node.x, -1500, 1500);
            node.y = clamp(node.y, -1500, 1500);
        });
    }

    function applyCollision(nodes) {
        const padding = 14;
        for (let indexA = 0; indexA < nodes.length; indexA += 1) {
            const nodeA = nodes[indexA];
            const rA = nodeRadius(nodeA);
            for (let indexB = indexA + 1; indexB < nodes.length; indexB += 1) {
                const nodeB = nodes[indexB];
                const rB = nodeRadius(nodeB);
                const dx = nodeB.x - nodeA.x;
                const dy = nodeB.y - nodeA.y;
                const distance = Math.sqrt(dx * dx + dy * dy) || 1;
                const minDist = rA + rB + padding;
                if (distance < minDist) {
                    const overlap = minDist - distance;
                    const pushX = (dx / distance) * overlap * 0.5 * Math.max(state.alpha, 0.1);
                    const pushY = (dy / distance) * overlap * 0.5 * Math.max(state.alpha, 0.1);
                    nodeA.x -= pushX;
                    nodeA.y -= pushY;
                    nodeB.x += pushX;
                    nodeB.y += pushY;
                }
            }
        }
    }

    function fitViewToNeighborhood(centerNode) {
        if (!centerNode) return;
        const neighbors = relatedNodesFor(centerNode);
        const nodes = [centerNode, ...neighbors];

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        nodes.forEach((node) => {
            const radius = nodeRadius(node);
            minX = Math.min(minX, node.x - radius);
            minY = Math.min(minY, node.y - radius);
            maxX = Math.max(maxX, node.x + radius);
            maxY = Math.max(maxY, node.y + radius);
        });

        const width = Math.max(maxX - minX, 1);
        const height = Math.max(maxY - minY, 1);
        const padding = 72;
        const scaleX = (state.width - padding * 2) / width;
        const scaleY = (state.height - padding * 2) / height;
        const scale = clamp(Math.min(scaleX, scaleY, 1.4), config.view.minScale, config.view.maxScale);
        const centerX = (minX + maxX) * 0.5;
        const centerY = (minY + maxY) * 0.5;

        state.view.scale = scale;
        state.view.x = state.width * 0.5 - centerX * scale;
        state.view.y = state.height * 0.5 - centerY * scale;
    }

    function stepSimulation() {
        if (state.visibleNodes.length === 0) return false;
        applyAnchorForce(state.visibleNodes);
        applyCenterForce(state.visibleNodes);
        applyRepulsion(state.visibleNodes);
        applyLinkForce(state.visibleLinks);
        integrate(state.visibleNodes);
        applyCollision(state.visibleNodes);
        state.alpha = Math.max(0, state.alpha * config.force.alphaDecay);
        return Boolean(state.draggingNode) || state.alpha > config.force.settleFloor;
    }

    function prewarmLayout(iterations = config.force.prewarm) {
        for (let index = 0; index < iterations; index += 1) {
            if (!stepSimulation()) break;
        }
    }

    function requestFrame() {
        if (!state.frame) {
            state.frame = window.requestAnimationFrame(tick);
        }
    }

    function tick() {
        state.frame = 0;
        const keepGoing = stepSimulation();
        draw();
        if (keepGoing) requestFrame();
    }

    function nodePalette(kind) {
        if (kind === "tag") {
            return {
                fill: css("--graph-tag-fill", "#94ad94"),
                stroke: css("--graph-tag-stroke", "#708d70"),
                label: css("--graph-tag-label", "#465a47")
            };
        }
        if (kind === "category") {
            return {
                fill: css("--graph-category-fill", "#a995a2"),
                stroke: css("--graph-category-stroke", "#846d7c"),
                label: css("--graph-category-label", "#544653")
            };
        }
        return {
            fill: css("--graph-post-fill", "#49404f"),
            stroke: css("--graph-post-stroke", "#2f2934"),
            label: css("--graph-post-label", "#342d39")
        };
    }

    function computeVisualState(node, focusSet, hoverSet) {
        const isFocused = Boolean(state.focusNode && node.id === state.focusNode.id);
        const isNeighbor = !isFocused && focusSet.has(node.id);
        const isHovered = Boolean(state.hoverNode && node.id === state.hoverNode.id);
        const isHoverNeighbor = !isHovered && hoverSet.has(node.id);

        let alpha = 0.98;
        if (state.focusNode) {
            alpha = focusSet.has(node.id) ? 1 : config.focusFade;
        } else if (state.hoverNode) {
            alpha = hoverSet.has(node.id) ? (isHovered ? 1 : 0.82) : config.hoverFade;
        }
        if (isHovered) alpha = 1;

        const scale = isFocused ? 1.18 : isHovered ? 1.14 : isNeighbor || isHoverNeighbor ? 1.06 : 1;
        return { isFocused, isNeighbor, isHovered, isHoverNeighbor, alpha, scale };
    }

    function drawEdges(focusSet, hoverSet) {
        const focusId = state.focusNode ? state.focusNode.id : null;
        const hoverId = state.hoverNode ? state.hoverNode.id : null;
        const isLocal = state.localViewActive && focusId;

        // Group links into style batches with three clue-path states: default, neighbor, focus
        const batches = {
            default: [],
            neighbor: [],
            focus: []
        };

        state.visibleLinks.forEach((link) => {
            const source = state.nodeMap.get(link.source);
            const target = state.nodeMap.get(link.target);
            if (!source || !target) return;

            if (isLocal && link.source !== focusId && link.target !== focusId) return;
            if (!source.onScreen && !target.onScreen) return;

            const incidentToFocus = Boolean(focusId && (link.source === focusId || link.target === focusId));
            const incidentToHover = Boolean(hoverId && (link.source === hoverId || link.target === hoverId));
            const insideFocus = Boolean(focusId && focusSet.has(link.source) && focusSet.has(link.target));
            const insideHover = Boolean(hoverId && hoverSet.has(link.source) && hoverSet.has(link.target));

            let styleKey = "default";
            if (incidentToFocus || incidentToHover) {
                styleKey = "focus";
            } else if (insideFocus || insideHover) {
                styleKey = "neighbor";
            }

            batches[styleKey].push({ source, target });
        });

        ctx.save();
        ctx.translate(state.view.x, state.view.y);
        ctx.scale(state.view.scale, state.view.scale);

        Object.entries(batches).forEach(([styleKey, links]) => {
            if (links.length === 0) return;

            ctx.save();
            ctx.beginPath();
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            if (styleKey === "focus") {
                ctx.strokeStyle = css("--graph-edge-focus", "rgba(170, 52, 70, 0.82)");
                ctx.lineWidth = 2.2 / state.view.scale;
                ctx.globalAlpha = 1;
            } else if (styleKey === "neighbor") {
                ctx.strokeStyle = css("--graph-edge-neighbor", "rgba(160, 64, 78, 0.58)");
                ctx.lineWidth = 1.45 / state.view.scale;
                ctx.globalAlpha = 1;
            } else {
                ctx.strokeStyle = css("--graph-edge-default", "rgba(150, 72, 82, 0.34)");
                ctx.lineWidth = 1.0 / state.view.scale;
                ctx.globalAlpha = focusId || hoverId ? 0.48 : 0.9;
            }

            links.forEach(({ source, target }) => {
                ctx.moveTo(source.x, source.y);
                ctx.lineTo(target.x, target.y);
            });

            ctx.stroke();
            ctx.restore();
        });

        ctx.restore();
    }

    function labelSpec(node, visual) {
        // High priority override: hovered/focused nodes and their direct neighbors always show labels
        const isAlwaysShown = visual.isFocused || visual.isHovered || visual.isNeighbor || visual.isHoverNeighbor;

        if (!isAlwaysShown) {
            if (state.view.scale < 0.6) {
                // Zoom < 0.6: Hide all labels except category nodes (and focused/hovered/neighbors)
                if (node.kind !== "category") return null;
            } else if (state.view.scale < 1.0) {
                // Zoom < 1.0: Show tag/category labels; hide post labels unless hovered/focused
                if (node.kind === "post") return null;
            }
            if (isMobileView() && state.view.scale < 1.18 && node.kind === "post") {
                return null;
            }
            // Zoom >= 1.0: Show labels normally according to degree thresholds
        }

        const degree = state.degrees.get(node.id) || 0;
        const threshold = config.labels.thresholds[node.kind] || config.labels.thresholds.post;
        const show = isAlwaysShown
            || state.ambientLabelIds.has(node.id)
            || degree >= threshold;
        if (!show) return null;

        const palette = nodePalette(node.kind);
        const screen = { x: node.screenX, y: node.screenY };
        const alignLeft = node.kind === "post" || screen.x < state.width * 0.54;
        const priority = visual.isFocused
            ? 120
            : visual.isHovered
                ? 110
                : visual.isNeighbor
                    ? 100
                    : node.featured
                        ? 90
                        : scoreNode(node);

        let fontSize = node.kind === "category" ? 12.6 : node.kind === "tag" ? 11.6 : 11;
        if (visual.isFocused || visual.isHovered) fontSize += 1.3;
        if (visual.isNeighbor || visual.isHoverNeighbor) fontSize += 0.5;

        return {
            x: screen.x + (alignLeft ? 12 : -12),
            y: screen.y - (visual.isFocused || visual.isHovered ? 14 : 12),
            align: alignLeft ? "left" : "right",
            font: `${visual.isFocused || visual.isHovered ? "600" : "550"} ${fontSize}px Alice, Gabriela, Georgia, serif`,
            size: fontSize,
            color: visual.isFocused || visual.isHovered ? css("--graph-label-strong", "#251f29") : palette.label,
            alpha: visual.alpha * (visual.isFocused || visual.isHovered ? 1 : 0.98),
            stroke: css("--graph-label-stroke", "rgba(252, 248, 243, 0.98)"),
            shadow: css("--graph-label-shadow", "rgba(255, 251, 246, 0.74)"),
            haloWidth: visual.isFocused || visual.isHovered ? 5.6 : visual.isNeighbor || visual.isHoverNeighbor ? 4.8 : 4.2,
            shadowBlur: visual.isFocused || visual.isHovered ? 7 : visual.isNeighbor || visual.isHoverNeighbor ? 5 : 3,
            priority,
            text: node.label
        };
    }

    function drawNodesAndLabels(focusSet, hoverSet) {
        const labels = [];
        const focusId = state.focusNode ? state.focusNode.id : null;
        const isLocal = state.localViewActive && focusId;

        ctx.save();
        ctx.translate(state.view.x, state.view.y);
        ctx.scale(state.view.scale, state.view.scale);

        state.visibleNodes.forEach((node) => {
            // Local View filter: only draw focused node and its direct neighbors
            if (isLocal) {
                if (node.id !== focusId && !focusSet.has(node.id)) return;
            }

            if (!visibleScreen(node, 120)) return;
            const palette = nodePalette(node.kind);
            const visual = computeVisualState(node, focusSet, hoverSet);
            const radius = nodeRadius(node) * visual.scale;

            ctx.save();
            ctx.globalAlpha = visual.alpha;

            if (visual.isFocused || visual.isHovered) {
                // Outer soft glow ring
                ctx.beginPath();
                ctx.fillStyle = visual.isFocused
                    ? css("--graph-node-selected-glow-outer", "rgba(126, 86, 112, 0.12)")
                    : css("--graph-node-hover-glow-outer", "rgba(104, 145, 109, 0.12)");
                ctx.arc(node.x, node.y, radius + 13.0, 0, Math.PI * 2);
                ctx.fill();

                // Inner soft glow ring
                ctx.beginPath();
                ctx.fillStyle = visual.isFocused
                    ? css("--graph-node-selected-glow-inner", "rgba(126, 86, 112, 0.26)")
                    : css("--graph-node-hover-glow-inner", "rgba(104, 145, 109, 0.26)");
                ctx.arc(node.x, node.y, radius + 6.5, 0, Math.PI * 2);
                ctx.fill();
            } else if (visual.isNeighbor || visual.isHoverNeighbor) {
                // Neighbor halo
                ctx.beginPath();
                ctx.fillStyle = css("--graph-node-neighbor", "rgba(104, 145, 109, 0.16)");
                ctx.arc(node.x, node.y, radius + 5.5, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.beginPath();
            ctx.fillStyle = palette.fill;
            ctx.strokeStyle = visual.isFocused || visual.isHovered
                ? css("--graph-node-outline-strong", "rgba(31, 27, 34, 0.92)")
                : visual.isNeighbor || visual.isHoverNeighbor
                    ? css("--graph-node-outline-medium", "rgba(46, 40, 48, 0.72)")
                    : palette.stroke;
            ctx.lineWidth = (visual.isFocused || visual.isHovered ? 2.25 : visual.isNeighbor || visual.isHoverNeighbor ? 1.6 : 1.3) / state.view.scale;
            ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            const label = labelSpec(node, visual);
            if (label) labels.push(label);
        });

        ctx.restore();
        drawLabels(labels);
    }

    function boxesIntersect(boxA, boxB) {
        return boxA.x < boxB.x + boxB.width
            && boxA.x + boxA.width > boxB.x
            && boxA.y < boxB.y + boxB.height
            && boxA.y + boxA.height > boxB.y;
    }

    function drawLabels(labels) {
        const occupied = [];

        labels.sort((labelA, labelB) => labelB.priority - labelA.priority).forEach((label) => {
            ctx.save();
            ctx.font = label.font;
            ctx.textAlign = label.align;
            ctx.textBaseline = "middle";

            const width = ctx.measureText(label.text).width;
            const box = {
                x: label.align === "left" ? label.x - 4 : label.x - width - 4,
                y: label.y - label.size * 0.72,
                width: width + 8,
                height: label.size * 1.45
            };

            const forceDraw = label.priority >= 100;
            const collides = occupied.some((other) => boxesIntersect(box, other));
            if (!forceDraw && collides) {
                ctx.restore();
                return;
            }

            occupied.push(box);
            const drawX = Math.round(label.x);
            const drawY = Math.round(label.y);
            ctx.globalAlpha = label.alpha;
            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            ctx.shadowColor = label.shadow;
            ctx.shadowBlur = label.shadowBlur;
            ctx.lineWidth = label.haloWidth;
            ctx.strokeStyle = label.stroke;
            ctx.strokeText(label.text, drawX, drawY);
            ctx.shadowBlur = 0;
            ctx.fillStyle = label.color;
            ctx.fillText(label.text, drawX, drawY);
            ctx.restore();
        });
    }

    function draw() {
        ctx.clearRect(0, 0, state.width, state.height);

        // Precompute screen coordinates for all visible nodes
        const margin = 120;
        state.visibleNodes.forEach((node) => {
            const screen = worldToScreen(node);
            node.screenX = screen.x;
            node.screenY = screen.y;
            node.onScreen = screen.x >= -margin && screen.x <= state.width + margin
                         && screen.y >= -margin && screen.y <= state.height + margin;
        });

        const focusSet = neighborhoodSet(state.focusNode);
        const hoverSet = neighborhoodSet(state.hoverNode);
        drawEdges(focusSet, hoverSet);
        drawNodesAndLabels(focusSet, hoverSet);
    }

    function syncHover(point) {
        if (state.draggingNode) {
            state.hoverNode = state.draggingNode;
            return;
        }
        if (state.panning) return;

        const nextNode = nearestNode(point);
        if (nextNode !== state.hoverNode) {
            state.hoverNode = nextNode;
            updateInspector();
            draw();
        }
        canvas.style.cursor = nextNode ? "pointer" : "grab";
    }

    function setViewScale(nextScale, origin) {
        const clampedScale = clamp(nextScale, config.view.minScale, config.view.maxScale);
        const world = screenToWorld(origin);
        state.view.scale = clampedScale;
        state.view.x = origin.x - world.x * clampedScale;
        state.view.y = origin.y - world.y * clampedScale;
    }

    function runViewAction(action) {
        if (!state.visibleNodes.length) return;

        if (action === "fit") {
            state.userMovedView = false;
            fitViewToNodes();
        } else if (action === "zoom-in") {
            state.userMovedView = true;
            setViewScale(state.view.scale * 1.18, viewCenter());
        } else if (action === "zoom-out") {
            state.userMovedView = true;
            setViewScale(state.view.scale / 1.18, viewCenter());
        } else {
            return;
        }

        draw();
        requestFrame();
    }

    function hasModifier(event) {
        return Boolean(event && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey));
    }

    function openNode(node, options = {}) {
        if (!node || !node.url) return false;
        const { newTab = false, reason = "unknown" } = options;
        debugLog("opened URL", reason, describeNode(node));
        if (newTab) {
            window.open(node.url, "_blank", "noopener");
        } else {
            window.location.assign(node.url);
        }
        return true;
    }

    function pointerDistance(pointA, pointB) {
        const dx = pointB.x - pointA.x;
        const dy = pointB.y - pointA.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function pointerMidpoint(pointA, pointB) {
        return {
            x: (pointA.x + pointB.x) * 0.5,
            y: (pointA.y + pointB.y) * 0.5
        };
    }

    function syncPointer(event) {
        if (event.pointerId === undefined) return;
        state.activePointers.set(event.pointerId, pointerPosition(event));
    }

    function clearPointer(event) {
        if (event.pointerId === undefined) return;
        state.activePointers.delete(event.pointerId);
    }

    function maybeStartPinch() {
        if (state.activePointers.size < 2) return false;
        const points = Array.from(state.activePointers.values()).slice(0, 2);
        const midpoint = pointerMidpoint(points[0], points[1]);
        state.pinchGesture = {
            startDistance: Math.max(pointerDistance(points[0], points[1]), 1),
            startScale: state.view.scale,
            worldMidpoint: screenToWorld(midpoint)
        };
        state.pointerMoved = true;
        state.draggingNode = null;
        state.dragOriginNode = null;
        state.panning = false;
        canvas.style.cursor = "grabbing";
        return true;
    }

    function updatePinchGesture() {
        if (!state.pinchGesture || state.activePointers.size < 2) return false;
        const points = Array.from(state.activePointers.values()).slice(0, 2);
        const midpoint = pointerMidpoint(points[0], points[1]);
        const distance = Math.max(pointerDistance(points[0], points[1]), 1);
        const nextScale = state.pinchGesture.startScale * (distance / state.pinchGesture.startDistance);
        const clampedScale = clamp(nextScale, config.view.minScale, config.view.maxScale);

        state.view.scale = clampedScale;
        state.view.x = midpoint.x - state.pinchGesture.worldMidpoint.x * clampedScale;
        state.view.y = midpoint.y - state.pinchGesture.worldMidpoint.y * clampedScale;
        state.userMovedView = true;
        draw();
        return true;
    }

    function attachEvents() {
        if (state.eventsBound) return;
        state.eventsBound = true;

        const refreshCanvasLayout = () => {
            updateCanvasSize();
            ensureNodePositions(state.rawNodes);
            if (!state.userMovedView) fitViewToNodes();
            draw();
            requestFrame();
        };

        const finishPointer = (event) => {
            if (!state.pointerDown) return;
            if (state.pointerId !== null && event.pointerId !== undefined && event.pointerId !== state.pointerId) return;

            const point = typeof event.clientX === "number" && typeof event.clientY === "number"
                ? pointerPosition(event)
                : state.pointerScreen;
            const startedOnBlank = state.panning;
            const releasedNode = nearestNode(point);
            const clickedBlank = startedOnBlank && !releasedNode && !state.pointerMoved;
            const wasDraggingNode = Boolean(state.dragOriginNode);
            const modifierOpen = Boolean(releasedNode
                && hasModifier(event)
                && (releasedNode.kind === "tag" || releasedNode.kind === "category")
                && releasedNode.url);

            if (state.pinchGesture) {
                debugLog("drag end", "pinch");
            }

            if (releasedNode) {
                noteHit(releasedNode, "pointerup");
            }

            if (!state.pointerMoved && !state.pinchGesture) {
                if (releasedNode) {
                    state.focusNode = releasedNode;
                    debugLog("click target", describeNode(releasedNode));
                    if (state.localViewActive) {
                        fitViewToNeighborhood(state.focusNode);
                    }
                    if (modifierOpen) {
                        openNode(releasedNode, {
                            newTab: event.metaKey || event.ctrlKey,
                            reason: "modifier-click"
                        });
                    }
                } else if (clickedBlank) {
                    clearFocus();
                }
            }

            if (wasDraggingNode) {
                debugLog("drag end", describeNode(state.dragOriginNode));
            }

            clearPointer(event);
            state.pointerDown = false;
            state.pointerMoved = false;
            state.draggingNode = null;
            state.dragOriginNode = null;
            state.panning = false;
            state.pointerId = null;
            state.pinchGesture = null;
            state.alpha = Math.max(state.alpha, 0.18);

            if (canvas.releasePointerCapture && event.pointerId !== undefined && canvas.hasPointerCapture?.(event.pointerId)) {
                canvas.releasePointerCapture(event.pointerId);
            }
            updateInspector();
            syncHover(point);
            draw();
            requestFrame();
        };

        canvas.addEventListener("pointerdown", (event) => {
            const point = pointerPosition(event);
            const node = nearestNode(point);
            syncPointer(event);
            state.pointerDown = true;
            state.pointerMoved = false;
            state.pointerId = event.pointerId;
            state.pointerScreen = point;
            state.dragStartScreen = point;
            state.dragStartView = { ...state.view };
            state.draggingNode = node;
            state.dragOriginNode = node;
            state.panning = !node;
            noteHit(node, "pointerdown");
            if (node) {
                debugLog("drag start", describeNode(node));
            }
            if (maybeStartPinch()) {
                debugLog("drag start", "pinch");
            }
            canvas.style.cursor = "grabbing";
            if (canvas.setPointerCapture) canvas.setPointerCapture(event.pointerId);
        });

        canvas.addEventListener("pointermove", (event) => {
            const point = pointerPosition(event);
            state.pointerScreen = point;
            syncPointer(event);

            if (state.pointerDown) {
                if (updatePinchGesture()) {
                    debugLog("drag move", "pinch", { scale: state.view.scale });
                    return;
                }

                const dx = point.x - state.dragStartScreen.x;
                const dy = point.y - state.dragStartScreen.y;
                if (Math.abs(dx) > 3 || Math.abs(dy) > 3) state.pointerMoved = true;

                if (state.draggingNode) {
                    state.hoverNode = state.draggingNode;
                    state.alpha = Math.max(state.alpha, 0.42);

                    // Update node position immediately in world coordinates to prevent 1-frame latency/jitter
                    const world = screenToWorld(point);
                    state.draggingNode.x = world.x;
                    state.draggingNode.y = world.y;
                    state.draggingNode.vx = 0;
                    state.draggingNode.vy = 0;
                    debugLog("drag move", describeNode(state.draggingNode), world);

                    draw();
                    requestFrame();
                    return;
                }

                if (state.panning) {
                    state.userMovedView = true;
                    state.view.x = state.dragStartView.x + dx;
                    state.view.y = state.dragStartView.y + dy;
                    debugLog("drag move", "pan", { x: state.view.x, y: state.view.y });
                    draw();
                    canvas.style.cursor = "grabbing";
                    return;
                }
            }

            syncHover(point);
        });

        canvas.addEventListener("pointerleave", () => {
            if (state.pointerDown) return;
            state.hoverNode = null;
            state.lastHitNodeId = null;
            updateInspector();
            canvas.style.cursor = "grab";
            draw();
        });

        window.addEventListener("pointerup", finishPointer);
        window.addEventListener("pointercancel", finishPointer);

        canvas.addEventListener("dblclick", (event) => {
            const node = nearestNode(pointerPosition(event));
            debugLog("double click target", describeNode(node));
            if (!node) return;
            if (node.kind === "post" || node.kind === "tag" || node.kind === "category") {
                openNode(node, { reason: "double-click" });
            }
        });

        canvas.addEventListener("wheel", (event) => {
            event.preventDefault();
            const point = pointerPosition(event);
            const zoomFactor = Math.exp(-event.deltaY * 0.0012);
            setViewScale(state.view.scale * zoomFactor, point);
            state.userMovedView = true;
            draw();
            requestFrame();
        }, { passive: false });

        if (inspectorReset) {
            inspectorReset.addEventListener("click", () => {
                clearFocus();
                state.userMovedView = false;
                fitViewToNodes();
                canvas.style.cursor = "grab";
                draw();
            });
        }

        if (localToggle) {
            localToggle.addEventListener("click", () => {
                state.localViewActive = !state.localViewActive;
                localToggle.classList.toggle("is-active", state.localViewActive);
                if (state.localViewActive && state.focusNode) {
                    state.userMovedView = true;
                    fitViewToNeighborhood(state.focusNode);
                }
                draw();
            });
        }

        filterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                state.activeFilter = button.dataset.filter || "all";
                filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
                applyFilter();
                draw();
            });
        });

        viewButtons.forEach((button) => {
            button.addEventListener("click", () => {
                runViewAction(button.dataset.graphAction);
                canvas.style.cursor = "grab";
            });
        });

        state.resizeObserver = new ResizeObserver(() => {
            state.alpha = Math.max(state.alpha, 0.4);
            refreshCanvasLayout();
        });
        state.resizeObserver.observe(stage);
        window.addEventListener("orientationchange", refreshCanvasLayout, { passive: true });
        window.addEventListener("resize", refreshCanvasLayout, { passive: true });
    }

    async function bootstrap() {
        try {
            if (stats) stats.textContent = loadingLabel;
            const response = await fetch(graphUrl, { credentials: "same-origin" });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const payload = await response.json();

            state.rawNodes = (payload.nodes || []).map((node) => ({ ...node }));
            state.rawLinks = payload.links || [];
            state.nodeMap = new Map(state.rawNodes.map((node) => [node.id, node]));
            debugLog("graph data loaded", {
                nodes: state.rawNodes.length,
                links: state.rawLinks.length
            });

            updateCanvasSize();
            ensureNodePositions(state.rawNodes);
            attachEvents();
            applyFilter();
            prewarmLayout();
            updateInspector();
            canvas.style.cursor = "grab";
            draw();
            requestFrame();
        } catch (error) {
            if (stats) stats.textContent = errorLabel;
            if (emptyState) {
                emptyState.hidden = false;
                emptyState.textContent = errorLabel;
            }
        }
    }

    bootstrap();
})();
