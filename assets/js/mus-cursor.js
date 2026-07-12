(() => {
    const root = document.documentElement;
    const finePointerMedia = window.matchMedia("(pointer: fine)");
    const hoverMedia = window.matchMedia("(hover: hover)");
    const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hasTouchDevice =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0;

    if (
        !finePointerMedia.matches ||
        !hoverMedia.matches ||
        hasTouchDevice ||
        reducedMotionMedia.matches
    ) {
        return;
    }

    const clickableSelector = [
        "a",
        "button",
        "[role=\"button\"]",
        "input[type=\"submit\"]",
        "input[type=\"button\"]",
        ".post-entry",
        ".archive-entry",
        ".entry-link",
        ".button",
        ".btn",
        ".nav-link",
        ".lang-link",
        ".nav-menu-toggle",
        ".top-link",
        "#theme-toggle",
        ".lang-switch",
        "summary",
        "[data-cursor=\"hover\"]"
    ].join(", ");

    const hoverExclusionSelector = [
        "input:not([type=\"submit\"]):not([type=\"button\"])",
        "textarea",
        "select",
        "option",
        "code",
        "pre",
        ".highlight"
    ].join(", ");

    const nativeCursorZoneSelector = [
        "input",
        "textarea",
        "select",
        "option",
        "code",
        "pre",
        ".highlight",
        ".post-content .flowchart",
        ".post-content .flow-container",
        ".post-content .mus-flow-tree",
        ".post-content p",
        ".post-content li",
        ".post-content blockquote",
        ".entry-content p",
        ".entry-content li",
        ".entry-content blockquote"
    ].join(", ");

    const fragment = document.createDocumentFragment();
    const dot = document.createElement("div");
    const ring = document.createElement("div");

    dot.className = "mus-cursor-dot";
    ring.className = "mus-cursor-ring";
    dot.setAttribute("aria-hidden", "true");
    ring.setAttribute("aria-hidden", "true");

    fragment.append(dot, ring);
    document.body.appendChild(fragment);
    root.classList.add("mus-custom-cursor-enabled");

    // Track pointer position and animate the outer ring with a soft delay.
    let pointerX = window.innerWidth * 0.5;
    let pointerY = window.innerHeight * 0.5;
    let ringX = pointerX;
    let ringY = pointerY;
    let visible = false;
    let suppressed = false;
    let animationFrameId = 0;

    const addMediaListener = (mediaQueryList, listener) => {
        if (typeof mediaQueryList.addEventListener === "function") {
            mediaQueryList.addEventListener("change", listener);
            return;
        }

        if (typeof mediaQueryList.addListener === "function") {
            mediaQueryList.addListener(listener);
        }
    };

    const removeMediaListener = (mediaQueryList, listener) => {
        if (typeof mediaQueryList.removeEventListener === "function") {
            mediaQueryList.removeEventListener("change", listener);
            return;
        }

        if (typeof mediaQueryList.removeListener === "function") {
            mediaQueryList.removeListener(listener);
        }
    };

    const showCursor = () => {
        if (suppressed || visible) {
            return;
        }

        visible = true;
        dot.classList.add("is-visible");
        ring.classList.add("is-visible");
    };

    const hideCursor = () => {
        visible = false;
        dot.classList.remove("is-visible");
        ring.classList.remove("is-visible");
        dot.classList.remove("mus-cursor-hover", "mus-cursor-click");
        ring.classList.remove("mus-cursor-hover", "mus-cursor-click");
    };

    const setSuppressed = (nextSuppressed) => {
        suppressed = nextSuppressed;
        root.classList.toggle("mus-cursor-over-text", suppressed);

        if (suppressed) {
            hideCursor();
        } else {
            showCursor();
        }
    };

    const syncPointerContext = (target) => {
        if (!(target instanceof Element)) {
            dot.classList.remove("mus-cursor-hover");
            ring.classList.remove("mus-cursor-hover");
            return;
        }

        const clickableTarget = target.closest(clickableSelector);
        const hoverBlocked = target.closest(hoverExclusionSelector);
        const nativeCursorZone = !clickableTarget && target.closest(nativeCursorZoneSelector);

        setSuppressed(Boolean(nativeCursorZone));

        if (clickableTarget && !hoverBlocked) {
            dot.classList.add("mus-cursor-hover");
            ring.classList.add("mus-cursor-hover");
        } else {
            dot.classList.remove("mus-cursor-hover");
            ring.classList.remove("mus-cursor-hover");
        }
    };

    const render = () => {
        ringX += (pointerX - ringX) * 0.18;
        ringY += (pointerY - ringY) * 0.18;

        dot.style.transform =
            "translate3d(" +
            pointerX +
            "px, " +
            pointerY +
            "px, 0) translate(-50%, -50%) scale(var(--mus-cursor-dot-scale, 1))";
        ring.style.transform =
            "translate3d(" +
            ringX +
            "px, " +
            ringY +
            "px, 0) translate(-50%, -50%) scale(var(--mus-cursor-ring-scale, 1))";

        animationFrameId = window.requestAnimationFrame(render);
    };

    const handleMouseMove = (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        showCursor();
        syncPointerContext(event.target);
    };

    const handleMouseEnter = (event) => {
        syncPointerContext(event.target);

        if (!suppressed) {
            showCursor();
        }
    };

    const handleMouseLeave = () => {
        hideCursor();
    };

    const handleMouseDown = (event) => {
        syncPointerContext(event.target);

        if (suppressed) {
            return;
        }

        dot.classList.add("mus-cursor-click");
        ring.classList.add("mus-cursor-click");
        window.setTimeout(() => {
            dot.classList.remove("mus-cursor-click");
            ring.classList.remove("mus-cursor-click");
        }, 140);
    };

    const teardown = () => {
        window.cancelAnimationFrame(animationFrameId);
        root.classList.remove("mus-custom-cursor-enabled");
        root.classList.remove("mus-cursor-over-text");
        dot.remove();
        ring.remove();
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseenter", handleMouseEnter);
        window.removeEventListener("mouseleave", handleMouseLeave);
        window.removeEventListener("blur", handleMouseLeave);
        window.removeEventListener("mousedown", handleMouseDown);
        document.removeEventListener("mouseover", handleMouseEnter, true);
        removeMediaListener(finePointerMedia, handleMediaChange);
        removeMediaListener(hoverMedia, handleMediaChange);
        removeMediaListener(reducedMotionMedia, handleMediaChange);
    };

    const handleMediaChange = () => {
        if (
            !finePointerMedia.matches ||
            !hoverMedia.matches ||
            reducedMotionMedia.matches
        ) {
            teardown();
        }
    };

    // Keep the custom cursor invisible when the pointer leaves the viewport.
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("blur", handleMouseLeave, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    document.addEventListener("mouseover", handleMouseEnter, true);
    addMediaListener(finePointerMedia, handleMediaChange);
    addMediaListener(hoverMedia, handleMediaChange);
    addMediaListener(reducedMotionMedia, handleMediaChange);

    animationFrameId = window.requestAnimationFrame(render);
})();
