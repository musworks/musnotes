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
    const inspectorLink = root.querySelector("[data-graph-link]");
    const inspectorStatus = root.querySelector("[data-graph-status]");
    const inspectorReset = root.querySelector("[data-graph-reset]");
    const localToggle = root.querySelector("[data-graph-local-toggle]");
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
        category: root.dataset.typeCategory || "Category"
    };
    const connectionLabel = root.dataset.labelRelated || "Connected";

    function debugLog(...parts) {
        if (!DEBUG) return;
        console.log("[graph]", ...parts);
    }

    const config = {
        nodeRadius: { post: 5.6, category: 10.4 },
        degreeBoost: { post: 0.22, category: 0.34 },
        maxRadiusBoost: 5.2,
        pickPadding: 12,
        worldPadding: 46,
        focusFade: 0.045,
        hoverFade: 0.045,
        renderScale: { post: 0.84, category: 1.04 },
        strokeWidth: { post: 0.9, category: 1.5 },
        neighborOpacity: { post: 0.76, category: 0.98 },
        view: { minScale: 0.15, maxScale: 6.0, fitPadding: 56 },
        force: {
            repulsionSame: 52,
            repulsionCross: 82,
            repulsionStrength: 15,
            linkDistance: { category: 118 },
            linkStrength: 0.0032,
            anchorPull: { post: 0.00105, category: 0.00178 },
            centerPull: 0.00052,
            damping: 0.9,
            alphaDecay: 0.985
        },
        settling: {
            desktop: { iterations: 192, batchSize: 4, budgetMs: 4, alphaFloor: 0.055 },
            mobile: { iterations: 160, batchSize: 3, budgetMs: 3, alphaFloor: 0.09 },
            reduced: { iterations: 96, batchSize: 2, budgetMs: 2, alphaFloor: 0.24 }
        },
        labels: {
            ambientDesktop: { max: 14, categories: 10 },
            ambientMobile: { max: 7, categories: 5 },
            neighborhoodDesktop: 10,
            neighborhoodMobile: 6
        }
    };

    const state = {
        width: 0,
        height: 0,
        dpr: 1,
        alpha: 0,
        frame: 0,
        renderRequested: false,
        simulationRequested: false,
        settlingProfile: null,
        settlingIterationsRemaining: 0,
        settlingStepsCompleted: 0,
        deferSettlingUntilAfterRender: false,
        activeFilter: "all",
        rawNodes: [],
        rawLinks: [],
        nodeMap: new Map(),
        visibleNodes: [],
        visibleLinks: [],
        visibleNodeIds: new Set(),
        degrees: new Map(),
        adjacency: new Map(),
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
        themeObserver: null,
        motionQuery: null,
        activePointers: new Map(),
        pinchGesture: null,
        lastHitNodeId: null,
        pendingPointerMove: null,
        pendingWheelDelta: 0,
        pendingWheelOrigin: null,
        resizePending: false,
        palettes: null,
        colors: null
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

    function refreshStyleCache() {
        const local = getComputedStyle(root);
        const global = getComputedStyle(document.documentElement);
        const read = (name, fallback) => local.getPropertyValue(name).trim()
            || global.getPropertyValue(name).trim()
            || fallback;
        const readNumber = (name, fallback) => {
            const value = Number.parseFloat(read(name, String(fallback)));
            return Number.isFinite(value) ? value : fallback;
        };

        state.palettes = {
            category: {
                fill: read("--graph-category-fill", "#a995a2"),
                stroke: read("--graph-category-stroke", "#846d7c"),
                label: read("--graph-category-label", "#544653"),
                opacity: readNumber("--graph-category-opacity", 0.96)
            },
            post: {
                fill: read("--graph-post-fill", "#49404f"),
                stroke: read("--graph-post-stroke", "#2f2934"),
                label: read("--graph-post-label", "#342d39"),
                opacity: readNumber("--graph-post-opacity", 0.62)
            }
        };
        state.colors = {
            edgeFocus: read("--graph-edge-focus", "rgba(170, 52, 70, 0.82)"),
            edgeNeighbor: read("--graph-edge-neighbor", "rgba(160, 64, 78, 0.58)"),
            edgeDefault: read("--graph-edge-default", "rgba(150, 72, 82, 0.34)"),
            edgeDefaultAlpha: readNumber("--graph-edge-default-alpha", 0.72),
            edgeDimAlpha: readNumber("--graph-edge-dim-alpha", 0.16),
            labelStrong: read("--graph-label-strong", "#251f29"),
            labelStroke: read("--graph-label-stroke", "rgba(252, 248, 243, 0.98)"),
            selectedGlowOuter: read("--graph-node-selected-glow-outer", "rgba(126, 86, 112, 0.12)"),
            hoverGlowOuter: read("--graph-node-hover-glow-outer", "rgba(104, 145, 109, 0.12)"),
            selectedGlowInner: read("--graph-node-selected-glow-inner", "rgba(126, 86, 112, 0.26)"),
            hoverGlowInner: read("--graph-node-hover-glow-inner", "rgba(104, 145, 109, 0.26)"),
            nodeNeighbor: read("--graph-node-neighbor", "rgba(104, 145, 109, 0.16)"),
            nodeOutlineStrong: read("--graph-node-outline-strong", "rgba(31, 27, 34, 0.92)"),
            nodeOutlineMedium: read("--graph-node-outline-medium", "rgba(46, 40, 48, 0.72)")
        };
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

    function anchorFor(kind) {
        if (kind === "category") return { x: 0, y: -60, spreadX: 180, spreadY: 120 };
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

        links.forEach((link) => {
            if (!adjacency.has(link.source) || !adjacency.has(link.target)) return;
            adjacency.get(link.source).add(link.target);
            adjacency.get(link.target).add(link.source);
        });

        return adjacency;
    }

    function relatedNodesFor(node) {
        if (!node) return [];

        const order = { category: 0, post: 1 };
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

    function compareByDegreeThenLabel(nodeA, nodeB) {
        const degreeDiff = (state.degrees.get(nodeB.id) || 0) - (state.degrees.get(nodeA.id) || 0);
        if (degreeDiff !== 0) return degreeDiff;
        return nodeA.label.localeCompare(nodeB.label, undefined, { sensitivity: "base" });
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
        const policy = isMobileView() ? config.labels.ambientMobile : config.labels.ambientDesktop;
        const categories = state.visibleNodes
            .filter((node) => node.kind === "category")
            .sort(compareByDegreeThenLabel)
            .slice(0, policy.categories);
        state.ambientLabelIds = new Set(
            categories.slice(0, policy.max).map((node) => node.id)
        );
    }

    function neighborhoodLabelRanks() {
        const target = state.focusNode || state.hoverNode;
        if (!target) return new Map();
        const limit = isMobileView()
            ? config.labels.neighborhoodMobile
            : config.labels.neighborhoodDesktop;
        return new Map(
            relatedNodesFor(target).slice(0, limit).map((node, index) => [node.id, index])
        );
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
        requestRenderFrame();
    }

    function settlingProfile() {
        if (state.motionQuery?.matches) return config.settling.reduced;
        return isMobileView() ? config.settling.mobile : config.settling.desktop;
    }

    function prepareSettling(deferUntilAfterRender = false) {
        state.settlingProfile = settlingProfile();
        state.settlingIterationsRemaining = state.settlingProfile.iterations;
        state.settlingStepsCompleted = 0;
        state.deferSettlingUntilAfterRender = deferUntilAfterRender;
        state.alpha = 1;
        if (!deferUntilAfterRender) requestSimulationFrame();
    }

    function applyFilter(options = {}) {
        const { deferSettling = false } = options;
        const filters = {
            all: (node) => true,
            categories: (node) => node.kind === "category"
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
        prepareSettling(deferSettling);
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
            const desired = config.force.linkDistance.category;
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

    function stepSimulation(alphaFloor = settlingProfile().alphaFloor) {
        if (state.visibleNodes.length === 0) return false;
        applyAnchorForce(state.visibleNodes);
        applyCenterForce(state.visibleNodes);
        applyRepulsion(state.visibleNodes);
        applyLinkForce(state.visibleLinks);
        integrate(state.visibleNodes);
        applyCollision(state.visibleNodes);
        state.alpha = Math.max(0, state.alpha * config.force.alphaDecay);
        return Boolean(state.draggingNode) || state.alpha > alphaFloor;
    }

    function runSimulationBatch() {
        const isInitialSettling = state.settlingIterationsRemaining > 0;
        const profile = isInitialSettling ? state.settlingProfile : settlingProfile();
        const maxSteps = isInitialSettling
            ? Math.min(profile.batchSize, state.settlingIterationsRemaining)
            : 1;
        const startedAt = performance.now();
        let keepGoing = false;
        let steps = 0;

        while (steps < maxSteps) {
            keepGoing = stepSimulation(profile.alphaFloor);
            steps += 1;

            if (isInitialSettling) {
                state.settlingIterationsRemaining -= 1;
                state.settlingStepsCompleted += 1;
            }

            if (!keepGoing || performance.now() - startedAt >= profile.budgetMs) break;
        }

        if (isInitialSettling) {
            const settlingComplete = !keepGoing || state.settlingIterationsRemaining <= 0;
            if (settlingComplete) {
                state.settlingIterationsRemaining = 0;
                debugLog("initial settling complete", {
                    steps: state.settlingStepsCompleted,
                    alpha: state.alpha,
                    reducedMotion: Boolean(state.motionQuery?.matches)
                });
                return Boolean(state.draggingNode);
            }
        }

        return keepGoing;
    }

    function ensureFrame() {
        if (!state.frame) state.frame = window.requestAnimationFrame(runFrame);
    }

    // Render-only requests share the RAF coordinator but never enable force simulation.
    function requestRenderFrame() {
        state.renderRequested = true;
        ensureFrame();
    }

    // Simulation frames opt into stepping the layout, then render the resulting positions.
    function requestSimulationFrame() {
        state.simulationRequested = true;
        ensureFrame();
    }

    function runFrame() {
        state.frame = 0;
        const eventNeedsRender = flushPendingEvents();
        const shouldSimulate = state.simulationRequested;
        state.simulationRequested = false;

        const keepGoing = shouldSimulate ? runSimulationBatch() : false;
        const shouldRender = state.renderRequested || eventNeedsRender || shouldSimulate;
        state.renderRequested = false;

        if (shouldRender) draw();

        // Bootstrap paints deterministic positions once before incremental settling begins.
        if (state.deferSettlingUntilAfterRender && shouldRender) {
            state.deferSettlingUntilAfterRender = false;
            requestSimulationFrame();
        } else if (keepGoing) {
            requestSimulationFrame();
        }
    }

    function nodePalette(kind) {
        return state.palettes[kind] || state.palettes.post;
    }

    function computeVisualState(node, focusSet, hoverSet) {
        const isFocused = Boolean(state.focusNode && node.id === state.focusNode.id);
        const isNeighbor = !isFocused && focusSet.has(node.id);
        const isHovered = Boolean(state.hoverNode && node.id === state.hoverNode.id);
        const isHoverNeighbor = !isHovered && hoverSet.has(node.id);

        const baseOpacity = nodePalette(node.kind).opacity;
        const neighborOpacity = config.neighborOpacity[node.kind] || config.neighborOpacity.post;
        let alpha = baseOpacity;
        if (state.focusNode) {
            alpha = isFocused ? 1 : focusSet.has(node.id) ? neighborOpacity : config.focusFade;
        } else if (state.hoverNode) {
            alpha = isHovered ? 1 : hoverSet.has(node.id) ? neighborOpacity : config.hoverFade;
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
                ctx.strokeStyle = state.colors.edgeFocus;
                ctx.lineWidth = 2.2 / state.view.scale;
                ctx.globalAlpha = 1;
            } else if (styleKey === "neighbor") {
                ctx.strokeStyle = state.colors.edgeNeighbor;
                ctx.lineWidth = 1.45 / state.view.scale;
                ctx.globalAlpha = 1;
            } else {
                ctx.strokeStyle = state.colors.edgeDefault;
                ctx.lineWidth = 1.0 / state.view.scale;
                ctx.globalAlpha = focusId || hoverId
                    ? state.colors.edgeDimAlpha
                    : state.colors.edgeDefaultAlpha;
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

    function labelSpec(node, visual, neighborRanks) {
        const isMain = visual.isFocused || visual.isHovered;
        const neighborRank = neighborRanks.get(node.id);
        const isLabeledNeighbor = Number.isInteger(neighborRank);
        const isAmbient = !state.focusNode
            && !state.hoverNode
            && state.ambientLabelIds.has(node.id);

        if (!isMain && !isLabeledNeighbor && !isAmbient) return null;
        if (isAmbient && node.kind === "post") return null;

        const palette = nodePalette(node.kind);
        const degree = state.degrees.get(node.id) || 0;
        const screen = { x: node.screenX, y: node.screenY };
        const alignLeft = node.kind === "post" || screen.x < state.width * 0.54;
        const priority = visual.isFocused
            ? 120
            : visual.isHovered
                ? 115
                : isLabeledNeighbor
                    ? 100 - neighborRank
                    : node.kind === "category"
                        ? 80 + Math.min(degree, 12)
                        : 60 + Math.min(degree, 12);

        let fontSize = node.kind === "category" ? 12.6 : 11;
        if (isMain) fontSize += 1.3;
        if (isLabeledNeighbor) fontSize += 0.35;

        return {
            x: screen.x + (alignLeft ? 12 : -12),
            y: screen.y - (isMain ? 14 : 12),
            align: alignLeft ? "left" : "right",
            font: `${isMain ? "600" : node.kind === "category" ? "550" : "500"} ${fontSize}px Alice, Gabriela, Georgia, serif`,
            size: fontSize,
            color: isMain ? state.colors.labelStrong : palette.label,
            alpha: isMain ? 1 : isLabeledNeighbor ? Math.max(visual.alpha, 0.82) : Math.min(0.94, palette.opacity + 0.08),
            stroke: state.colors.labelStroke,
            haloWidth: isMain ? 3.2 : isLabeledNeighbor ? 1.8 : 0,
            forceDraw: isMain,
            priority,
            text: node.label
        };
    }

    function drawNodesAndLabels(focusSet, hoverSet, neighborRanks) {
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
            const renderScale = config.renderScale[node.kind] || config.renderScale.post;
            const radius = nodeRadius(node) * renderScale * visual.scale;

            ctx.save();
            ctx.globalAlpha = visual.alpha;

            if (visual.isFocused || visual.isHovered) {
                // Outer soft glow ring
                ctx.beginPath();
                ctx.fillStyle = visual.isFocused
                    ? state.colors.selectedGlowOuter
                    : state.colors.hoverGlowOuter;
                ctx.arc(node.x, node.y, radius + 13.0, 0, Math.PI * 2);
                ctx.fill();

                // Inner soft glow ring
                ctx.beginPath();
                ctx.fillStyle = visual.isFocused
                    ? state.colors.selectedGlowInner
                    : state.colors.hoverGlowInner;
                ctx.arc(node.x, node.y, radius + 6.5, 0, Math.PI * 2);
                ctx.fill();
            } else if (visual.isNeighbor || visual.isHoverNeighbor) {
                // Neighbor halo
                ctx.beginPath();
                ctx.fillStyle = state.colors.nodeNeighbor;
                ctx.arc(node.x, node.y, radius + 5.5, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.beginPath();
            ctx.fillStyle = palette.fill;
            ctx.strokeStyle = visual.isFocused || visual.isHovered
                ? state.colors.nodeOutlineStrong
                : visual.isNeighbor || visual.isHoverNeighbor
                    ? state.colors.nodeOutlineMedium
                    : palette.stroke;
            const baseStrokeWidth = config.strokeWidth[node.kind] || config.strokeWidth.post;
            ctx.lineWidth = (visual.isFocused || visual.isHovered
                ? 2.25
                : visual.isNeighbor || visual.isHoverNeighbor
                    ? Math.max(baseStrokeWidth, 1.6)
                    : baseStrokeWidth) / state.view.scale;
            ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            const label = labelSpec(node, visual, neighborRanks);
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

            const forceDraw = label.forceDraw;
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
            if (label.haloWidth > 0) {
                ctx.lineWidth = label.haloWidth;
                ctx.strokeStyle = label.stroke;
                ctx.strokeText(label.text, drawX, drawY);
            }
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
        const neighborRanks = neighborhoodLabelRanks();
        drawEdges(focusSet, hoverSet);
        drawNodesAndLabels(focusSet, hoverSet, neighborRanks);
    }

    function syncHover(point) {
        if (state.draggingNode) {
            state.hoverNode = state.draggingNode;
            return false;
        }
        if (state.panning) return false;

        const nextNode = nearestNode(point);
        const changed = nextNode !== state.hoverNode;
        if (nextNode !== state.hoverNode) {
            state.hoverNode = nextNode;
            updateInspector();
        }
        canvas.style.cursor = nextNode ? "pointer" : "grab";
        return changed;
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

        requestRenderFrame();
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

    function syncPointer(event, point = pointerPosition(event)) {
        if (event.pointerId === undefined) return;
        state.activePointers.set(event.pointerId, point);
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
        return true;
    }

    function processPointerMove(move) {
        if (!move) return false;
        const { point } = move;
        state.pointerScreen = point;

        if (state.pointerDown) {
            if (updatePinchGesture()) {
                debugLog("drag move", "pinch", { scale: state.view.scale });
                return true;
            }

            const dx = point.x - state.dragStartScreen.x;
            const dy = point.y - state.dragStartScreen.y;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) state.pointerMoved = true;

            if (state.draggingNode) {
                state.hoverNode = state.draggingNode;
                state.alpha = Math.max(state.alpha, 0.42);

                const world = screenToWorld(point);
                state.draggingNode.x = world.x;
                state.draggingNode.y = world.y;
                state.draggingNode.vx = 0;
                state.draggingNode.vy = 0;
                debugLog("drag move", describeNode(state.draggingNode), world);
                requestSimulationFrame();
                return true;
            }

            if (state.panning) {
                state.userMovedView = true;
                state.view.x = state.dragStartView.x + dx;
                state.view.y = state.dragStartView.y + dy;
                debugLog("drag move", "pan", { x: state.view.x, y: state.view.y });
                canvas.style.cursor = "grabbing";
                return true;
            }
        }

        return syncHover(point);
    }

    function flushPendingEvents() {
        let needsRender = false;

        if (state.resizePending) {
            state.resizePending = false;
            updateCanvasSize();
            ensureNodePositions(state.rawNodes);
            rebuildAmbientLabels();
            if (!state.userMovedView) fitViewToNodes();
            needsRender = true;
        }

        if (state.pendingWheelDelta !== 0 && state.pendingWheelOrigin) {
            const zoomFactor = Math.exp(-state.pendingWheelDelta * 0.0012);
            setViewScale(state.view.scale * zoomFactor, state.pendingWheelOrigin);
            state.userMovedView = true;
            state.pendingWheelDelta = 0;
            state.pendingWheelOrigin = null;
            needsRender = true;
        }

        if (state.pendingPointerMove) {
            const move = state.pendingPointerMove;
            state.pendingPointerMove = null;
            needsRender = processPointerMove(move) || needsRender;
        }

        return needsRender;
    }

    function attachEvents() {
        if (state.eventsBound) return;
        state.eventsBound = true;

        const queueCanvasLayout = () => {
            state.resizePending = true;
            ensureFrame();
        };

        const finishPointer = (event) => {
            if (!state.pointerDown) return;
            if (state.pointerId !== null && event.pointerId !== undefined && event.pointerId !== state.pointerId) return;

            if (state.pendingPointerMove && state.pendingPointerMove.pointerId === event.pointerId) {
                const move = state.pendingPointerMove;
                state.pendingPointerMove = null;
                processPointerMove(move);
            }

            const point = typeof event.clientX === "number" && typeof event.clientY === "number"
                ? pointerPosition(event)
                : state.pointerScreen;
            const startedOnBlank = state.panning;
            const releasedNode = nearestNode(point);
            const clickedBlank = startedOnBlank && !releasedNode && !state.pointerMoved;
            const wasDraggingNode = Boolean(state.dragOriginNode);
            const didDragNode = wasDraggingNode && state.pointerMoved;
            const modifierOpen = Boolean(releasedNode
                && hasModifier(event)
                && releasedNode.kind === "category"
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
            if (didDragNode) {
                state.alpha = Math.max(state.alpha, 0.18);
                requestSimulationFrame();
            }

            if (canvas.releasePointerCapture && event.pointerId !== undefined && canvas.hasPointerCapture?.(event.pointerId)) {
                canvas.releasePointerCapture(event.pointerId);
            }
            updateInspector();
            syncHover(point);
            requestRenderFrame();
        };

        canvas.addEventListener("pointerdown", (event) => {
            const point = pointerPosition(event);
            const node = nearestNode(point);
            syncPointer(event, point);
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
            syncPointer(event, point);
            state.pendingPointerMove = { pointerId: event.pointerId, point };
            ensureFrame();
        });

        canvas.addEventListener("pointerleave", () => {
            if (state.pointerDown) return;
            state.pendingPointerMove = null;
            state.hoverNode = null;
            state.lastHitNodeId = null;
            updateInspector();
            canvas.style.cursor = "grab";
            requestRenderFrame();
        });

        window.addEventListener("pointerup", finishPointer);
        window.addEventListener("pointercancel", finishPointer);

        canvas.addEventListener("dblclick", (event) => {
            const node = nearestNode(pointerPosition(event));
            debugLog("double click target", describeNode(node));
            if (!node) return;
            if (node.kind === "post" || node.kind === "category") {
                openNode(node, { reason: "double-click" });
            }
        });

        canvas.addEventListener("wheel", (event) => {
            event.preventDefault();
            state.pendingWheelDelta += event.deltaY;
            state.pendingWheelOrigin = pointerPosition(event);
            ensureFrame();
        }, { passive: false });

        if (inspectorReset) {
            inspectorReset.addEventListener("click", () => {
                clearFocus();
                state.userMovedView = false;
                fitViewToNodes();
                canvas.style.cursor = "grab";
                requestRenderFrame();
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
                requestRenderFrame();
            });
        }

        filterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                state.activeFilter = button.dataset.filter || "all";
                filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
                applyFilter();
            });
        });

        viewButtons.forEach((button) => {
            button.addEventListener("click", () => {
                runViewAction(button.dataset.graphAction);
                canvas.style.cursor = "grab";
            });
        });

        state.resizeObserver = new ResizeObserver(queueCanvasLayout);
        state.resizeObserver.observe(stage);
        window.addEventListener("orientationchange", queueCanvasLayout, { passive: true });
        window.addEventListener("resize", queueCanvasLayout, { passive: true });

        state.themeObserver = new MutationObserver(() => {
            refreshStyleCache();
            requestRenderFrame();
        });
        state.themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"]
        });
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

            state.motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
            refreshStyleCache();
            updateCanvasSize();
            ensureNodePositions(state.rawNodes);
            attachEvents();
            applyFilter({ deferSettling: true });
            updateInspector();
            canvas.style.cursor = "grab";
            requestRenderFrame();
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
