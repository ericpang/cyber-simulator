/**
 * Drag and Drop Resizer for Dashboard Panels
 * Implements smooth vertical and horizontal resizes for flex grid panels
 */

console.log("resizable.js loaded, readyState:", document.readyState);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initResizers();
  });
} else {
  initResizers();
}

function initResizers() {
  const vResizers = document.querySelectorAll(".resizer-v");
  const hResizers = document.querySelectorAll(".resizer-h");
  console.log("initResizers called. Found vResizers:", vResizers.length, "hResizers:", hResizers.length);

  vResizers.forEach(resizer => {
    const leftPanel = resizer.previousElementSibling;

    resizer.addEventListener("mousedown", (e) => {
      e.preventDefault();
      console.log("Resizer mousedown triggered on element:", resizer, "at X:", e.clientX);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const startX = e.clientX;
      const startLeftWidth = leftPanel.getBoundingClientRect().width;
      const containerWidth = leftPanel.parentElement.getBoundingClientRect().width;
      console.log("startLeftWidth:", startLeftWidth, "containerWidth:", containerWidth);

      const onMouseMove = (moveEvent) => {
        const deltaX = moveEvent.clientX - startX;
        let newLeftWidth = startLeftWidth + deltaX;
        let leftPercent = (newLeftWidth / containerWidth) * 100;
        console.log("mousemove - deltaX:", deltaX, "newLeftWidth:", newLeftWidth, "leftPercent:", leftPercent);

        // Apply limits (min 15%, max 85%)
        if (leftPercent >= 15 && leftPercent <= 85) {
          leftPanel.style.width = `${leftPercent}%`;
          console.log("Applied leftPanel.style.width:", leftPanel.style.width);
          // Force layout recalculations (SVG maps & charts)
          window.dispatchEvent(new Event("resize"));
        } else {
          console.log("leftPercent out of bounds [15, 85]:", leftPercent);
        }
      };

      const onMouseUp = () => {
        console.log("Resizer mouseup triggered");
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  });

  // 2. Vertical Splitters (Resizing rows stacked vertically)
  hResizers.forEach(resizer => {
    const topPanel = resizer.previousElementSibling;

    resizer.addEventListener("mousedown", (e) => {
      e.preventDefault();
      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";

      const startY = e.clientY;
      const startTopHeight = topPanel.getBoundingClientRect().height;
      const containerHeight = topPanel.parentElement.getBoundingClientRect().height;

      const onMouseMove = (moveEvent) => {
        const deltaY = moveEvent.clientY - startY;
        let newTopHeight = startTopHeight + deltaY;
        let topPercent = (newTopHeight / containerHeight) * 100;

        // Apply limits (min 20%, max 80%)
        if (topPercent >= 20 && topPercent <= 80) {
          topPanel.style.height = `${topPercent}%`;
          // Force layout recalculations
          window.dispatchEvent(new Event("resize"));
        }
      };

      const onMouseUp = () => {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  });

  // 3. Panel Maximize / Expand & Dock Back on Double-Click
  initPanelMaximize();
}

function togglePanelMaximize(panel) {
  const isExpanded = panel.classList.contains("panel-expanded");

  // Dock any currently expanded panel first
  document.querySelectorAll(".dashboard-panel.panel-expanded").forEach(p => {
    p.classList.remove("panel-expanded");
    const hint = p.querySelector(".panel-dock-hint");
    if (hint) hint.remove();
  });

  if (!isExpanded) {
    // Expand panel out to occupy full 5 panels area
    panel.classList.add("panel-expanded");

    const hint = document.createElement("div");
    hint.className = "panel-dock-hint font-mono text-[10px] text-blue-400 bg-blue-950/80 border border-blue-500/40 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg select-none cursor-pointer transition hover:bg-blue-900/90";
    hint.innerHTML = `<svg class="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg> <span>DOUBLE-CLICK OR ESC TO DOCK BACK</span>`;

    hint.addEventListener("click", (evt) => {
      evt.stopPropagation();
      togglePanelMaximize(panel);
    });
    panel.appendChild(hint);
  }

  // Trigger resize for SVG maps & canvas charts
  window.dispatchEvent(new Event("resize"));
}

function initPanelMaximize() {
  const panels = document.querySelectorAll(".dashboard-panel");
  console.log("initPanelMaximize initialized on", panels.length, "panels.");

  panels.forEach(panel => {
    panel.setAttribute("title", "Double-click to expand / dock panel");

    // Click handler for header expand buttons
    const btn = panel.querySelector(".panel-expand-btn");
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        togglePanelMaximize(panel);
      });
    }

    panel.addEventListener("dblclick", (e) => {
      // Ignore interactive controls or resizers
      if (e.target.closest("button, input, select, textarea, a, option, label, .resizer-v, .resizer-h, .panel-dock-hint")) {
        return;
      }

      e.stopPropagation();

      // Clear any text selection automatically created by browser double click
      if (window.getSelection) {
        try {
          window.getSelection().removeAllRanges();
        } catch (err) {}
      }

      togglePanelMaximize(panel);
    });
  });

  // Global ESC key listener to dock back any expanded panel
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const expandedPanel = document.querySelector(".dashboard-panel.panel-expanded");
      if (expandedPanel) {
        togglePanelMaximize(expandedPanel);
      }
    }
  });
}


