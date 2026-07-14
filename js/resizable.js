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
}
