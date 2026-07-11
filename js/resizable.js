/**
 * Drag and Drop Resizer for Dashboard Panels
 * Implements smooth vertical and horizontal resizes for flex grid panels
 */

document.addEventListener("DOMContentLoaded", () => {
  initResizers();
});

function initResizers() {
  // 1. Horizontal Splitters (Resizing columns side-by-side)
  const vResizers = document.querySelectorAll(".resizer-v");
  vResizers.forEach(resizer => {
    const leftPanel = resizer.previousElementSibling;
    const rightPanel = resizer.nextElementSibling;

    resizer.addEventListener("mousedown", (e) => {
      e.preventDefault();
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const startX = e.clientX;
      const startLeftWidth = leftPanel.getBoundingClientRect().width;
      const startRightWidth = rightPanel.getBoundingClientRect().width;
      const totalWidth = startLeftWidth + startRightWidth;

      const onMouseMove = (moveEvent) => {
        const deltaX = moveEvent.clientX - startX;
        let newLeftWidth = startLeftWidth + deltaX;
        let leftPercent = (newLeftWidth / totalWidth) * 100;
        let rightPercent = 100 - leftPercent;

        // Apply limits (min 15%, max 85%)
        if (leftPercent >= 15 && leftPercent <= 85) {
          leftPanel.style.width = `${leftPercent}%`;
          rightPanel.style.width = `${rightPercent}%`;
          // Force layout recalculations (SVG maps & charts)
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

  // 2. Vertical Splitters (Resizing rows stacked vertically)
  const hResizers = document.querySelectorAll(".resizer-h");
  hResizers.forEach(resizer => {
    const topPanel = resizer.previousElementSibling;
    const bottomPanel = resizer.nextElementSibling;

    resizer.addEventListener("mousedown", (e) => {
      e.preventDefault();
      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";

      const startY = e.clientY;
      const startTopHeight = topPanel.getBoundingClientRect().height;
      const startBottomHeight = bottomPanel.getBoundingClientRect().height;
      const totalHeight = startTopHeight + startBottomHeight;

      const onMouseMove = (moveEvent) => {
        const deltaY = moveEvent.clientY - startY;
        let newTopHeight = startTopHeight + deltaY;
        let topPercent = (newTopHeight / totalHeight) * 100;
        let bottomPercent = 100 - topPercent;

        // Apply limits (min 20%, max 80%)
        if (topPercent >= 20 && topPercent <= 80) {
          topPanel.style.height = `${topPercent}%`;
          bottomPanel.style.height = `${bottomPercent}%`;
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
