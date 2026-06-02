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
    const inspectorStatus = root.querySelector("[data-graph-status]");
    const inspectorReset = root.querySelector("[data-graph-reset]");
    const relatedWrap = root.querySelector("[data-graph-related-wrap]");
    const relatedList = root.querySelector("[data-graph-related]");
    const relatedLabelNode = relatedWrap ? relatedWrap.querySelector(".graph-inspector__related-label") : null;
    const filterButtons = Array.from(root.querySelectorAll("[data-filter]"));
    const layerButtons = Array.from(root.querySelectorAll("[data-layer]"));
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
    const idleStateLabel = root.dataset.idleState || "No focus yet";
    const hoverStateLabel = root.dataset.hoverState || "Preview";
    const selectedStateLabel = root.dataset.selectedState || "Selected";
    const relatedLabel = root.dataset.labelRelated || "Connected";
    const relatedMoreTemplate = root.dataset.relatedMore || "+ {count} more";
    const resetLabel = root.dataset.resetLabel || "Reset focus";
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

    const config = {
        node: {
            baseRadius: { post: 5.8, tag: 9.2, category: 11.5 },
            degreeMultiplier: 0.28,
            maxRadiusBoost: 5.5,
            touchBoost: 1.45,
            hitPadding: 12,
            boundaryPadding: 40
        },
        force: {
            anchorPull: { post: 0.00135, tag: 0.00195, category: 0.00195 },
            repulsionSameKind: 52,
            repulsionCrossKind: 78,
            repulsionStrength: 14,
            linkDesired: { tag: 92, category: 110 },
            linkStrength: 0.0032,
            damping: 0.86,
            alphaDecay: 0.988,
            settleFloor: 0.03,
            prewarmIterations: 180
        },
        edge: {
            alphaDefault: 0.62,
            alphaNeighbor: 0.78,
            alphaFocused: 0.9,
            alphaFaded: 0.24,
            widthDefault: { tag: 1.64, category: 2.36 },
            widthNeighbor: 1.96,
            widthFocused: { tag: 2.28, category: 2.88 }
        },
        mobile: {
            breakpoint: 768,
            labelDensityScale: 0.6,
            prewarmIterations: 140
        },
        overview: {
            maxNodes: 28,
            categoryMinDegree: 1,
            tagMinDegree: 5,
            postMinDegree: 8,
            reserveCategories: 8,
            reserveTags: 12,
            reservePosts: 8
        },
        overviewEdges: {
            maxLinks: 34,
            keepCategoryLinks: true,
            keepTagLinks: true,
            postLinkDegreeFloor: 8
        },
        layout: {
            safeInset: 72,
            softBoundaryStrength: 0.0032,
            centerBias: 0.00076,
            ringPull: {
                post: 0.00082,
                tag: 0.00118,
                category: 0.00172
            }
        },
        label: {
            categoryDegreeThreshold: 2,
            tagDegreeThreshold: 6,
            postDegreeThreshold: 11,
            maxIdleLabels: 14,
            maxOverviewLabels: 8
        }
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
        pointerDown: false,
        pointerStart: { x: 0, y: 0 },
        didDrag: false,
        frame: 0,
        searchQuery: "",
        highlightedIds: new Set(),
        physicsPreset: "medium",
        viewMode: "overview",
        priorityNodeIds: new Set(),
        // NEW: Layer system
        layerMode: 'none', // 'none' | '1st' | '2nd'
        visibleLayers: new Set(), // tracks which layers are visible
        activeThreads: new Set(), // selected semantic threads
        threadType: 'all', // 'all' | 'section' | 'date' | 'theme'
        showFullView: true, // layers vs full graph toggle
        featuredNodeIds: new Set(), // marked for curation
        threads: { bySection: {}, byDate: {}, byTheme: {} } // thread definitions
    };

    const maxRelatedItems = 10;

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

    function isMobileView() {
        const isNarrow = state.width > 0 && state.width < config.mobile.breakpoint;
        const coarsePointer = window.matchMedia ? window.matchMedia("(pointer: coarse)").matches : false;
        const multiTouch = typeof navigator.maxTouchPoints === "number" && navigator.maxTouchPoints > 0;
        return isNarrow || coarsePointer || multiTouch;
    }

    function anchorFor(kind) {
        const centerX = state.width * 0.5;
        const centerY = state.height * 0.525;

        if (kind === "category") {
            return { x: centerX, y: centerY, spreadX: state.width * 0.165, spreadY: state.height * 0.152 };
        }
        if (kind === "tag") {
            return { x: centerX, y: centerY - state.height * 0.026, spreadX: state.width * 0.325, spreadY: state.height * 0.268 };
        }
        return { x: centerX, y: centerY + state.height * 0.04, spreadX: state.width * 0.43, spreadY: state.height * 0.342 };
    }

    function initializeNode(node) {
        const anchor = anchorFor(node.kind);
        const angle = seeded(`${node.id}:angle`) * Math.PI * 2;
        const distance = Math.sqrt(seeded(`${node.id}:radius`));
        node.x = anchor.x + Math.cos(angle) * anchor.spreadX * distance;
        node.y = anchor.y + Math.sin(angle) * anchor.spreadY * distance;
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

    function sortByScore(nodes, degrees) {
        return [...nodes].sort((nodeA, nodeB) => {
            const scoreDiff = scoreNode(nodeB, degrees) - scoreNode(nodeA, degrees);
            if (scoreDiff !== 0) return scoreDiff;
            return nodeA.label.localeCompare(nodeB.label, undefined, { sensitivity: "base" });
        });
    }

    function scoreNode(node, degrees = state.degrees) {
        const degree = degrees.get(node.id) || 0;
        const kindWeight = node.kind === "category" ? 18 : node.kind === "tag" ? 10 : 0;
        return degree * 10 + kindWeight;
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

    function getNeighborsOfDegree(node, degree = 1) {
        if (!node || !state.adjacency) return new Set();
        if (degree === 0) return new Set();
        
        const neighbors = new Set();
        const toVisit = [node.id];
        const visited = new Set([node.id]);
        let currentDegree = 0;
        
        while (currentDegree < degree && toVisit.length > 0) {
            const nextVisit = [];
            toVisit.forEach((id) => {
                const adjacentIds = state.adjacency.get(id) || new Set();
                adjacentIds.forEach((adjId) => {
                    if (!visited.has(adjId)) {
                        neighbors.add(adjId);
                        visited.add(adjId);
                        nextVisit.push(adjId);
                    }
                });
            });
            toVisit.splice(0, toVisit.length, ...nextVisit);
            currentDegree += 1;
        }
        
        return neighbors;
    }

    function isNodeInThread(node) {
        if (state.activeThreads.size === 0 || state.threadType === 'all') return true;
        
        for (const threadId of state.activeThreads) {
            const [threadType, threadValue] = threadId.split(':');
            
            if (threadType === 'section' && node.section === threadValue) return true;
            if (threadType === 'date' && node.date && node.date.startsWith(threadValue)) return true;
            if (threadType === 'theme' && node.themes && node.themes.includes(threadValue)) return true;
        }
        
        return false;
    }

    function getNodeLayerInfo(node) {
        if (state.layerMode === 'none' || !state.selectedNode) {
            return { layer: 'full', isFaded: false };
        }
        
        if (state.selectedNode.id === node.id) return { layer: 'center', isFaded: false };
        
        const firstDegreeNeighbors = getNeighborsOfDegree(state.selectedNode, 1);
        if (firstDegreeNeighbors.has(node.id)) {
            return { layer: '1st', isFaded: false };
        }
        
        if (state.layerMode === '2nd') {
            const secondDegreeNeighbors = getNeighborsOfDegree(state.selectedNode, 2);
            if (secondDegreeNeighbors.has(node.id)) {
                return { layer: '2nd', isFaded: false };
            }
        }
        
        return { layer: 'hidden', isFaded: true };
    }

    function getNodeLayerOpacity(node) {
        if (state.layerMode === 'none') return 1;
        
        const { isFaded } = getNodeLayerInfo(node);
        const isInThread = isNodeInThread(node);
        
        if (isFaded) return 0.3;
        if (!isInThread) return 0.6;
        return 1;
    }

    function getNodeLayerScale(node) {
        if (state.layerMode === 'none') return 1;
        
        const { isFaded } = getNodeLayerInfo(node);
        const isInThread = isNodeInThread(node);
        
        if (isFaded) return 0.8;
        if (!isInThread) return 0.85;
        return 1;
    }

    function getLinkLayerOpacity(link) {
        if (state.layerMode === 'none') return config.edge.alphaDefault;
        if (!state.selectedNode) return config.edge.alphaDefault;
        
        const firstDegreeNeighbors = getNeighborsOfDegree(state.selectedNode, 1);
        const isWithinFirstDegree = (firstDegreeNeighbors.has(link.source) && firstDegreeNeighbors.has(link.target)) || 
                                    (link.source === state.selectedNode.id || link.target === state.selectedNode.id);
        
        if (isWithinFirstDegree) return config.edge.alphaNeighbor;
        
        return config.edge.alphaFaded;
    }

    function getViewportTuning() {
        return isMobileView()
            ? { prewarmIterations: config.mobile.prewarmIterations, alphaFloor: 0.2 }
            : { prewarmIterations: config.force.prewarmIterations, alphaFloor: 0.14 };
    }

    function updateCanvasSize() {
        const rect = stage.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        state.width = Math.max(rect.width, 280);
        state.height = Math.max(rect.height, isMobileView() ? 360 : 320);
        canvas.width = Math.floor(state.width * dpr);
        canvas.height = Math.floor(state.height * dpr);
        canvas.style.width = `${state.width}px`;
        canvas.style.height = `${state.height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function activeNode() {
        return state.selectedNode || state.hoveredNode;
    }

    function visualHoverNode() {
        return state.selectedNode ? null : state.hoveredNode;
    }

    function relatedNodesFor(target) {
        if (!target) return [];
        const order = { category: 0, tag: 1, post: 2 };
        return Array.from(state.adjacency.get(target.id) || [])
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

    function updateInspector() {
        const target = activeNode();
        inspectorTitle.textContent = target ? target.label : defaultTitle;
        inspectorCopy.textContent = target ? (copyByKind[target.kind] || defaultCopy) : defaultCopy;
        inspectorFacts.innerHTML = "";

        if (inspectorStatus) {
            if (state.selectedNode) {
                inspectorStatus.textContent = selectedStateLabel;
            } else if (target) {
                inspectorStatus.textContent = hoverStateLabel;
            } else {
                inspectorStatus.textContent = idleStateLabel;
            }
        }

        if (inspectorReset) {
            inspectorReset.hidden = !state.selectedNode;
            inspectorReset.textContent = resetLabel;
        }

        if (!target) {
            if (relatedWrap) relatedWrap.hidden = true;
            if (relatedList) relatedList.innerHTML = "";
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

        if (relatedWrap && relatedList) {
            const relatedNodes = relatedNodesFor(target);
            relatedList.innerHTML = "";
            if (relatedLabelNode) relatedLabelNode.textContent = relatedLabel;
            if (relatedNodes.length > 0) {
                relatedWrap.hidden = false;
                relatedNodes.slice(0, maxRelatedItems).forEach((node) => {
                    const item = document.createElement(node.url ? "a" : "span");
                    item.className = "graph-inspector__related-item";
                    item.textContent = node.label;
                    if (node.url) item.href = node.url;
                    relatedList.append(item);
                });

                if (relatedNodes.length > maxRelatedItems) {
                    const more = document.createElement("span");
                    more.className = "graph-inspector__related-item";
                    more.textContent = relatedMoreTemplate.replace("{count}", String(relatedNodes.length - maxRelatedItems));
                    relatedList.append(more);
                }
            } else {
                relatedWrap.hidden = true;
            }
        }

        if (target.url) {
            inspectorLink.hidden = false;
            inspectorLink.href = target.url;
            inspectorLink.textContent = openLabel;
        } else {
            inspectorLink.hidden = true;
            inspectorLink.removeAttribute("href");
        }
    }

    function prewarmLayout(iterations = getViewportTuning().prewarmIterations) {
        if (state.visibleNodes.length === 0) return;
        const previousDraggingNode = state.draggingNode;
        state.draggingNode = null;
        state.alpha = Math.max(state.alpha, 0.92);
        for (let index = 0; index < iterations; index += 1) {
            stepSimulation();
            if (state.alpha < 0.05) break;
        }
        state.draggingNode = previousDraggingNode;
        state.alpha = Math.max(state.alpha, getViewportTuning().alphaFloor);
    }

    function getFilteredNodes() {
        const filters = {
            all: (node) => true,
            tags: (node) => node.kind === "tag",
            categories: (node) => node.kind === "category",
            "posts-tags": (node) => node.kind === "post" || node.kind === "tag"
        };

        const matcher = filters[state.activeFilter] || filters.all;
        return state.rawNodes.filter((node) => matcher(node));
    }

    function getVisibleGraph(filteredNodes) {
        const filteredIds = new Set(filteredNodes.map((node) => node.id));
        const filteredLinks = state.rawLinks.filter((link) => filteredIds.has(link.source) && filteredIds.has(link.target));

        return {
            nodes: filteredNodes,
            links: filteredLinks,
            priorityIds: new Set(filteredNodes.map((node) => node.id))
        };
    }

    function applyFilter() {
        const filteredNodes = getFilteredNodes();
        const visibleGraph = getVisibleGraph(filteredNodes);
        state.visibleNodes = visibleGraph.nodes;
        state.visibleLinks = visibleGraph.links;
        state.priorityNodeIds = visibleGraph.priorityIds;
        state.degrees = degreeMap(state.visibleNodes, state.visibleLinks);
        state.adjacency = adjacencyMap(state.visibleNodes, state.visibleLinks);

        const visibleIds = new Set(state.visibleNodes.map((node) => node.id));
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

        state.alpha = 0.96;
        prewarmLayout();
        updateInspector();
        draw();
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
        const degree = state.degrees.get(node.id) || 0;
        return config.node.baseRadius[node.kind] + Math.min(degree * config.node.degreeMultiplier, config.node.maxRadiusBoost);
    }

    function hitRadiusFor(node) {
        const touchBoost = isMobileView() ? config.node.touchBoost : 1;
        return radiusFor(node) * touchBoost + config.node.hitPadding;
    }

    function isPriorityNode(node) {
        return state.priorityNodeIds.has(node.id);
    }

    function nearestNode(x, y) {
        let best = null;
        let bestDistance = Infinity;
        state.visibleNodes.forEach((node) => {
            const dx = node.x - x;
            const dy = node.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < hitRadiusFor(node) && distance < bestDistance) {
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
        const hasFocus = Boolean(activeNode());
        const isMobile = isMobileView();
        const categoryThreshold = isMobile
            ? Math.ceil(config.label.categoryDegreeThreshold / config.mobile.labelDensityScale)
            : config.label.categoryDegreeThreshold;
        const tagThreshold = isMobile
            ? Math.ceil(config.label.tagDegreeThreshold / config.mobile.labelDensityScale)
            : config.label.tagDegreeThreshold;
        const postThreshold = isMobile
            ? Math.ceil(config.label.postDegreeThreshold / config.mobile.labelDensityScale)
            : config.label.postDegreeThreshold;
        const overviewPriority = state.viewMode === "overview" && isPriorityNode(node);
        const alwaysShow = (node.kind === "category" && degree >= categoryThreshold)
            || (node.kind === "tag" && degree >= tagThreshold)
            || (node.kind === "post" && degree >= postThreshold)
            || overviewPriority;
        const show = hasFocus ? highlighted || emphasized : alwaysShow || highlighted || emphasized;

        if (!show) return null;

        const palette = nodePalette(node.kind);
        let align = "left";
        let offsetX = 12;

        if (node.x < 70) {
            align = "left";
            offsetX = 12;
        } else if (node.x > state.width - 70) {
            align = "right";
            offsetX = -12;
        } else if (node.x < state.width * 0.5) {
            align = "right";
            offsetX = -12;
        }

        const fontSize = emphasized
            ? 13.2
            : highlighted
                ? 12.7
                : node.kind === "category"
                    ? 12.5
                    : node.kind === "tag"
                        ? 11.9
                        : alwaysShow
                            ? 11.5
                            : 10.9;

        return {
            font: `${emphasized || highlighted || node.kind === "category" ? "600" : alwaysShow ? "500" : "400"} ${fontSize}px Alice, Georgia, serif`,
            color: emphasized || highlighted
                ? css("--graph-label-strong", palette.label)
                : alwaysShow
                    ? palette.label
                    : css("--graph-label-muted", palette.label),
            align,
            offsetX,
            offsetY: emphasized ? -14 : -12,
            alpha: emphasized
                ? 1
                : highlighted
                    ? 0.98
                    : state.viewMode === "overview"
                        ? node.kind === "category"
                            ? 0.96
                            : node.kind === "tag"
                                ? 0.92
                                : 0.9
                        : node.kind === "category"
                            ? 0.94
                            : node.kind === "tag"
                                ? 0.9
                                : 0.86,
            lineWidth: emphasized
                ? 5
                : highlighted
                    ? 4.8
                    : node.kind === "category"
                        ? 4.7
                        : 4.45
        };
    }

    function drawLabel(node, style, faded) {
        if (!style) return;
        ctx.save();
        ctx.globalAlpha = faded ? style.alpha * (state.viewMode === "overview" ? 0.9 : 0.84) : style.alpha;
        ctx.font = style.font;
        ctx.textAlign = style.align;
        ctx.textBaseline = "middle";
        ctx.lineWidth = style.lineWidth;
        ctx.strokeStyle = css("--graph-label-stroke", "rgba(248, 243, 236, 0.98)");
        ctx.strokeText(node.label, node.x + style.offsetX, node.y + style.offsetY);
        ctx.fillStyle = style.color;
        ctx.fillText(node.label, node.x + style.offsetX, node.y + style.offsetY);
        ctx.restore();
    }

    function labelPriority(node, highlighted, emphasized) {
        const degree = state.degrees.get(node.id) || 0;
        if (emphasized) return 1000 + degree;
        if (highlighted) return 900 + degree;
        if (state.viewMode === "overview" && isPriorityNode(node)) return 760 + degree;
        if (node.kind === "category") return 700 + degree;
        if (node.kind === "tag") return 500 + degree;
        return 300 + degree;
    }

    function labelBounds(node, style) {
        ctx.save();
        ctx.font = style.font;
        const width = ctx.measureText(node.label).width;
        ctx.restore();

        const fontMatch = /(\d+(?:\.\d+)?)px/.exec(style.font);
        const height = (fontMatch ? Number(fontMatch[1]) : 11) + 6;
        const x = node.x + style.offsetX;
        const y = node.y + style.offsetY;

        return {
            left: style.align === "left" ? x - 1 : x - width - 1,
            right: style.align === "left" ? x + width + 1 : x + 1,
            top: y - height * 0.5,
            bottom: y + height * 0.5
        };
    }

    function overlapsLabel(boxA, boxB) {
        return boxA.left < boxB.right
            && boxA.right > boxB.left
            && boxA.top < boxB.bottom
            && boxA.bottom > boxB.top;
    }

    function drawLabels(entries) {
        const placed = [];
        let idleCount = 0;
        const idleLimit = state.viewMode === "overview" ? config.label.maxOverviewLabels : config.label.maxIdleLabels;
        entries
            .sort((entryA, entryB) => entryB.priority - entryA.priority)
            .forEach((entry) => {
                const box = labelBounds(entry.node, entry.style);
                const forced = entry.priority >= 900;
                const outside = box.left < 8 || box.right > state.width - 8 || box.top < 8 || box.bottom > state.height - 8;
                const collides = placed.some((candidate) => overlapsLabel(box, candidate));
                const isIdle = !forced && !activeNode();

                if (!forced && (outside || collides)) return;
                if (isIdle && idleCount >= idleLimit) return;

                drawLabel(entry.node, entry.style, entry.faded);
                placed.push(box);
                if (isIdle) idleCount += 1;
            });
    }

    function getVisualState(node, focusId, neighborIds, hoveredNodeId) {
        const isHovered = Boolean(hoveredNodeId && hoveredNodeId === node.id);
        const isSelected = Boolean(state.selectedNode && state.selectedNode.id === node.id);
        const isFocused = isHovered || isSelected;
        const isNeighbor = Boolean(focusId && neighborIds.has(node.id));
        const faded = Boolean(focusId && !isFocused && !isNeighbor);
        
        // Apply layer visibility
        const layerOpacity = getNodeLayerOpacity(node);
        const layerScale = getNodeLayerScale(node);
        const isInThread = isNodeInThread(node);
        
        return { 
            isHovered, 
            isSelected, 
            isFocused, 
            isNeighbor, 
            faded,
            layerOpacity,
            layerScale,
            isInThread
        };
    }

    function isNodeInViewport(node) {
        const radius = radiusFor(node) * 1.5; // Slight margin
        const padding = 50;
        return node.x > -padding - radius 
            && node.x < state.width + padding + radius
            && node.y > -padding - radius 
            && node.y < state.height + padding + radius;
    }

    function shouldDrawEdge(source, target) {
        // Draw if at least one endpoint is in viewport
        return isNodeInViewport(source) || isNodeInViewport(target);
    }

    function drawEdges(focusId, neighborIds) {
        state.visibleLinks.forEach((link) => {
            const source = state.nodeMap.get(link.source);
            const target = state.nodeMap.get(link.target);
            if (!source || !target) return;

            // Skip links if both endpoints are out of viewport
            if (!shouldDrawEdge(source, target)) return;

            const isFocused = Boolean(focusId && (source.id === focusId || target.id === focusId));
            const isNeighborLink = Boolean(!isFocused && focusId && neighborIds.has(source.id) && neighborIds.has(target.id));
            const faded = Boolean(focusId && !isFocused && !isNeighborLink);
            const kind = link.kind === "category" ? "category" : "tag";
            const kindAlphaBoost = state.viewMode === "overview"
                ? (kind === "category" ? 1.08 : 0.98)
                : 1;

            // NEW: apply layer-based link opacity
            const layerAlpha = getLinkLayerOpacity(link);
            const sourceInThread = isNodeInThread(source);
            const targetInThread = isNodeInThread(target);
            const bothInThread = sourceInThread && targetInThread;
            const threadAlpha = bothInThread ? 1 : 0.4;

            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = kind === "category"
                ? css("--graph-link-category", "rgba(132, 96, 118, 0.46)")
                : css("--graph-link-tag", "rgba(111, 145, 113, 0.48)");
            ctx.globalAlpha = (faded
                ? config.edge.alphaFaded
                : isFocused
                    ? config.edge.alphaFocused
                    : isNeighborLink
                        ? config.edge.alphaNeighbor
                        : config.edge.alphaDefault) * kindAlphaBoost * threadAlpha;
            ctx.lineWidth = isFocused
                ? config.edge.widthFocused[kind]
                : isNeighborLink
                    ? config.edge.widthNeighbor
                    : config.edge.widthDefault[kind];
            ctx.moveTo(source.x, source.y);
            ctx.quadraticCurveTo(
                (source.x + target.x) * 0.5,
                (source.y + target.y) * 0.5 + (source.kind === "post" ? 6 : -6),
                target.x,
                target.y
            );
            ctx.stroke();
            ctx.restore();
        });
    }

    function drawNodes(focusId, neighborIds, hoveredNodeId) {
        const labelEntries = [];

        state.visibleNodes.forEach((node) => {
            // Skip nodes outside viewport for performance
            if (!isNodeInViewport(node)) return;

            const palette = nodePalette(node.kind);
            const visual = getVisualState(node, focusId, neighborIds, hoveredNodeId);
            const radius = radiusFor(node);
            const idleScale = state.viewMode === "overview"
                ? (node.kind === "category" ? 1.14 : node.kind === "tag" ? 1.07 : 1.01)
                : node.kind === "category" ? 1.08 : node.kind === "tag" ? 1.03 : 1;
            const layerBaseScale = visual.layerScale; // NEW: layer-based scale
            const scale = visual.isHovered ? 1.16 : visual.isSelected ? 1.12 : visual.isNeighbor ? 1.05 : idleScale;
            const finalScale = scale * layerBaseScale; // NEW: combine scales
            const drawRadius = radius * finalScale;

            ctx.save();
            // NEW: apply layer opacity
            const baseAlpha = state.viewMode === "overview"
                ? (visual.faded ? 0.82 : 0.98)
                : visual.faded ? 0.76 : 1;
            ctx.globalAlpha = baseAlpha * visual.layerOpacity;

            if (visual.isFocused || visual.isNeighbor) {
                ctx.beginPath();
                ctx.fillStyle = visual.isFocused
                    ? (visual.isHovered ? css("--graph-node-hover", "rgba(87, 117, 98, 0.22)") : css("--graph-node-selected", "rgba(126, 91, 114, 0.24)"))
                    : css("--graph-node-neighbor", "rgba(87, 117, 98, 0.15)");
                ctx.arc(node.x, node.y, drawRadius + (visual.isFocused ? 8.5 : 6.2), 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.beginPath();
            ctx.fillStyle = palette.fill;
            ctx.strokeStyle = visual.isFocused
                ? css("--graph-node-outline-strong", "rgba(43, 46, 49, 0.9)")
                : visual.isNeighbor
                    ? css("--graph-node-outline-medium", "rgba(43, 46, 49, 0.52)")
                    : palette.stroke;
            ctx.lineWidth = visual.isFocused ? 2.25 : visual.isNeighbor ? 1.6 : node.kind === "category" ? 1.6 : node.kind === "tag" ? 1.35 : 1.22;
            ctx.arc(node.x, node.y, drawRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            const style = labelStyle(node, visual.isHovered || visual.isNeighbor, visual.isSelected);
            if (style) {
                labelEntries.push({
                    node,
                    style,
                    faded: visual.faded,
                    priority: labelPriority(node, visual.isHovered || visual.isNeighbor, visual.isSelected)
                });
            }
        });

        return labelEntries;
    }

    function draw() {
        ctx.clearRect(0, 0, state.width, state.height);

        const hoveredNode = visualHoverNode();
        const focus = activeNode();
        const focusId = focus ? focus.id : null;
        const neighborIds = focusId ? (state.adjacency.get(focusId) || new Set()) : new Set();
        const hoveredNodeId = hoveredNode ? hoveredNode.id : null;

        drawEdges(focusId, neighborIds);
        drawLabels(drawNodes(focusId, neighborIds, hoveredNodeId));
    }

    function applyAnchorForce(nodes) {
        nodes.forEach((node) => {
            const anchor = anchorFor(node.kind);
            const pull = config.layout.ringPull[node.kind] || config.force.anchorPull[node.kind] || config.force.anchorPull.post;
            node.vx += (anchor.x - node.x) * pull * state.alpha;
            node.vy += (anchor.y - node.y) * pull * state.alpha;
        });
    }

    function applyCenterBias(nodes) {
        const centerX = state.width * 0.5;
        const centerY = state.height * 0.52;

        nodes.forEach((node) => {
            node.vx += (centerX - node.x) * config.layout.centerBias * state.alpha;
            node.vy += (centerY - node.y) * config.layout.centerBias * state.alpha;
        });
    }

    function applyRepulsion(nodes) {
        for (let indexA = 0; indexA < nodes.length; indexA += 1) {
            const nodeA = nodes[indexA];
            for (let indexB = indexA + 1; indexB < nodes.length; indexB += 1) {
                const nodeB = nodes[indexB];
                const dx = nodeB.x - nodeA.x;
                const dy = nodeB.y - nodeA.y;
                const distanceSquared = Math.max(dx * dx + dy * dy, 64);
                const distance = Math.sqrt(distanceSquared);
                const repulsionBase = nodeA.kind === nodeB.kind
                    ? config.force.repulsionSameKind
                    : config.force.repulsionCrossKind;
                const repulsion = repulsionBase / distanceSquared;
                const pushX = (dx / distance) * repulsion * (config.force.repulsionStrength * 1.12) * state.alpha;
                const pushY = (dy / distance) * repulsion * (config.force.repulsionStrength * 1.12) * state.alpha;
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
            if (!source || !target) return;

            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
            const desired = link.kind === "category"
                ? config.force.linkDesired.category
                : config.force.linkDesired.tag;
            const force = (distance - desired) * config.force.linkStrength * state.alpha;
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;
            source.vx += fx;
            source.vy += fy;
            target.vx -= fx;
            target.vy -= fy;
        });
    }

    function applySoftBounds(nodes) {
        const inset = config.layout.safeInset;
        const maxX = state.width - inset;
        const maxY = state.height - inset;

        nodes.forEach((node) => {
            if (node.x < inset) {
                node.vx += (inset - node.x) * config.layout.softBoundaryStrength * state.alpha;
            } else if (node.x > maxX) {
                node.vx -= (node.x - maxX) * config.layout.softBoundaryStrength * state.alpha;
            }

            if (node.y < inset) {
                node.vy += (inset - node.y) * config.layout.softBoundaryStrength * state.alpha;
            } else if (node.y > maxY) {
                node.vy -= (node.y - maxY) * config.layout.softBoundaryStrength * state.alpha;
            }
        });
    }

    function integrateNodes(nodes) {
        const padding = config.node.boundaryPadding;

        nodes.forEach((node) => {
            if (state.draggingNode && state.draggingNode.id === node.id) {
                node.x = state.pointer.x;
                node.y = state.pointer.y;
                node.vx = 0;
                node.vy = 0;
                return;
            }

            node.vx *= config.force.damping;
            node.vy *= config.force.damping;
            node.x += node.vx;
            node.y += node.vy;
            node.x = Math.max(padding, Math.min(state.width - padding, node.x));
            node.y = Math.max(padding, Math.min(state.height - padding, node.y));
        });
    }

    function stepSimulation() {
        if (state.visibleNodes.length === 0) return false;

        applyAnchorForce(state.visibleNodes);
        applyCenterBias(state.visibleNodes);
        applyRepulsion(state.visibleNodes);
        applyLinkForce(state.visibleLinks);
        applySoftBounds(state.visibleNodes);
        integrateNodes(state.visibleNodes);

        state.alpha = Math.max(0, state.alpha * config.force.alphaDecay);
        return Boolean(state.draggingNode) || state.alpha > config.force.settleFloor;
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

    function clearFocus() {
        state.selectedNode = null;
        state.hoveredNode = null;
        state.layerMode = 'none';
        state.visibleLayers.clear();
        updateLayerButtons();
        updateInspector();
        draw();
    }

    function updateLayerMode(mode) {
        state.layerMode = mode;
        state.visibleLayers.clear();
        if (mode === '1st') state.visibleLayers.add('1st');
        if (mode === '2nd') state.visibleLayers.add('1st').add('2nd');
        
        updateLayerButtons();
        state.alpha = Math.max(state.alpha, 0.24);
        draw();
        requestFrame();
    }

    function updateLayerButtons() {
        layerButtons.forEach((button) => {
            const mode = button.dataset.layer;
            button.classList.toggle("is-active", mode === state.layerMode);
        });
    }

    function attachEvents() {
        const finishPointer = (event) => {
            if (!state.pointerDown && !state.draggingNode) return;

            if (typeof event.clientX === "number" && typeof event.clientY === "number") {
                state.pointer = pointerPosition(event);
            }

            const node = nearestNode(state.pointer.x, state.pointer.y);
            const clickedBlank = !node && !state.didDrag;

            if (!state.didDrag) {
                state.selectedNode = node || null;
                if (clickedBlank) {
                    state.hoveredNode = null;
                }
            }

            state.pointerDown = false;
            state.didDrag = false;
            state.draggingNode = null;
            state.alpha = Math.max(state.alpha, 0.16);
            canvas.style.cursor = state.hoveredNode ? "pointer" : "default";
            updateInspector();
            draw();
            requestFrame();
        };

        canvas.addEventListener("pointermove", (event) => {
            refreshHover(event);
            if (!state.pointerDown || !state.draggingNode) return;

            const distanceX = state.pointer.x - state.pointerStart.x;
            const distanceY = state.pointer.y - state.pointerStart.y;
            if (Math.abs(distanceX) > 3 || Math.abs(distanceY) > 3) {
                state.didDrag = true;
            }

            state.alpha = Math.max(state.alpha, 0.28);
            requestFrame();
        });

        canvas.addEventListener("pointerleave", () => {
            if (state.pointerDown) return;
            state.hoveredNode = null;
            canvas.style.cursor = "default";
            updateInspector();
            draw();
        });

        canvas.addEventListener("pointerdown", (event) => {
            state.pointer = pointerPosition(event);
            state.pointerStart = { ...state.pointer };
            state.pointerDown = true;
            state.didDrag = false;

            const node = nearestNode(state.pointer.x, state.pointer.y);
            if (!node) return;

            state.draggingNode = node;
            state.selectedNode = node;
            state.alpha = 0.86;
            canvas.style.cursor = "grabbing";
            if (canvas.setPointerCapture) {
                canvas.setPointerCapture(event.pointerId);
            }
            updateInspector();
            requestFrame();
        });

        window.addEventListener("pointerup", finishPointer);
        window.addEventListener("pointercancel", finishPointer);

        canvas.addEventListener("dblclick", (event) => {
            const point = pointerPosition(event);
            openNode(nearestNode(point.x, point.y));
        });

        if (inspectorReset) {
            inspectorReset.addEventListener("click", () => {
                clearFocus();
                canvas.style.cursor = "default";
            });
        }

        filterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                state.activeFilter = button.dataset.filter || "all";
                filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
                applyFilter();
            });
        });

        layerButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const mode = button.dataset.layer || "none";
                updateLayerMode(mode);
            });
        });

        const resizeObserver = new ResizeObserver(() => {
            updateCanvasSize();
            state.rawNodes.forEach((node) => {
                if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) {
                    initializeNode(node);
                }
            });
            state.alpha = Math.max(state.alpha, 0.68);
            prewarmLayout(90);
            draw();
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
            
            // Extract featured nodes
            state.featuredNodeIds = new Set(
                state.rawNodes
                    .filter((node) => node.featured === true)
                    .map((node) => node.id)
            );

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
