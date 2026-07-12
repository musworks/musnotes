(() => {
    const flowSelector = [
        ".post-content .flowchart",
        ".post-content .flow-container",
        ".post-content .mus-flow-tree"
    ].join(", ");

    const interactiveSelector = [
        "a",
        "button",
        "input",
        "textarea",
        "select",
        "summary",
        "[role=\"button\"]",
        "[tabindex]:not([tabindex=\"-1\"])"
    ].join(", ");

    const isScrollable = (element) => element.scrollWidth - element.clientWidth > 2;
    const hasVerticalFlowWrapper = (element) => {
        if (!element.matches(".flow-container")) {
            return false;
        }

        return Array.from(element.querySelectorAll(":scope > .flow-wrapper")).some((wrapper) => {
            return window.getComputedStyle(wrapper).flexDirection === "column";
        });
    };
    const isHorizontalScroller = (element) => isScrollable(element) && !hasVerticalFlowWrapper(element);
    const pageLang = (document.documentElement.lang || "").toLowerCase();
    const defaultLabel = pageLang.startsWith("id") ? "Diagram yang dapat digulir" : "Scrollable diagram";

    const setupFlowDragScroll = (scroller) => {
        if (!(scroller instanceof HTMLElement) || scroller.dataset.flowDragScroll === "true") {
            return;
        }

        scroller.dataset.flowDragScroll = "true";

        const syncAccessibility = () => {
            const horizontalScroller = isHorizontalScroller(scroller);
            scroller.classList.toggle("is-flow-scrollable", horizontalScroller);

            if (!horizontalScroller) {
                if (scroller.dataset.flowDragAddedTabindex === "true") {
                    scroller.removeAttribute("tabindex");
                    delete scroller.dataset.flowDragAddedTabindex;
                }

                return;
            }

            if (!scroller.hasAttribute("tabindex")) {
                scroller.tabIndex = 0;
                scroller.dataset.flowDragAddedTabindex = "true";
            }

            if (!scroller.hasAttribute("aria-label") && !scroller.hasAttribute("aria-labelledby")) {
                scroller.setAttribute("aria-label", defaultLabel);
                scroller.setAttribute("role", "region");
            }
        };

        let isPointerDown = false;
        let pointerId = null;
        let startX = 0;
        let startScrollLeft = 0;
        let suppressClick = false;

        const stopDrag = (event) => {
            if (!isPointerDown || ("pointerId" in event && event.pointerId !== pointerId)) {
                return;
            }

            if (typeof scroller.releasePointerCapture === "function" && pointerId !== null) {
                try {
                    scroller.releasePointerCapture(pointerId);
                } catch (error) {
                    // The pointer may already be released by the browser.
                }
            }

            isPointerDown = false;
            pointerId = null;
            scroller.classList.remove("is-dragging");
        };

        scroller.addEventListener("pointerdown", (event) => {
            const target = event.target instanceof Element ? event.target : null;
            const interactiveTarget = target ? target.closest(interactiveSelector) : null;

            if (
                event.button !== 0 ||
                event.pointerType === "touch" ||
                (interactiveTarget && interactiveTarget !== scroller) ||
                !isHorizontalScroller(scroller)
            ) {
                return;
            }

            isPointerDown = true;
            pointerId = event.pointerId;
            startX = event.clientX;
            startScrollLeft = scroller.scrollLeft;
            suppressClick = false;
            scroller.classList.add("is-dragging");

            if (typeof scroller.setPointerCapture === "function") {
                scroller.setPointerCapture(pointerId);
            }
        });

        scroller.addEventListener("pointermove", (event) => {
            if (!isPointerDown || event.pointerId !== pointerId) {
                return;
            }

            const deltaX = event.clientX - startX;

            if (Math.abs(deltaX) <= 3) {
                return;
            }

            suppressClick = true;
            event.preventDefault();
            scroller.scrollLeft = startScrollLeft - deltaX;
        });

        scroller.addEventListener("pointerup", stopDrag);
        scroller.addEventListener("pointercancel", stopDrag);

        scroller.addEventListener(
            "click",
            (event) => {
                if (!suppressClick) {
                    return;
                }

                suppressClick = false;
                event.preventDefault();
                event.stopPropagation();
            },
            true
        );

        scroller.addEventListener("keydown", (event) => {
            if (!isHorizontalScroller(scroller) || event.altKey || event.ctrlKey || event.metaKey) {
                return;
            }

            const step = Math.max(48, Math.round(scroller.clientWidth * 0.18));
            const keyMap = {
                ArrowLeft: -step,
                ArrowRight: step,
                Home: -scroller.scrollWidth,
                End: scroller.scrollWidth
            };

            if (!(event.key in keyMap)) {
                return;
            }

            event.preventDefault();
            scroller.scrollBy({ left: keyMap[event.key], behavior: "smooth" });
        });

        if (typeof ResizeObserver === "function") {
            const resizeObserver = new ResizeObserver(syncAccessibility);
            resizeObserver.observe(scroller);
        }

        syncAccessibility();
    };

    const init = () => {
        document.querySelectorAll(flowSelector).forEach(setupFlowDragScroll);
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
