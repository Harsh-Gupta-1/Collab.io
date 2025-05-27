export const fabric =
  window.fabric ||
  (() => {
    return {
      Canvas: class {
        constructor() {
          this.objects = [];
          this.isDrawingMode = false;
          this.selection = true;
          this.freeDrawingBrush = { color: "#000000", width: 3 };
          this.backgroundColor = "#ffffff";
          this.viewportTransform = [1, 0, 0, 1, 0, 0];
        }
        setHeight() {}
        setWidth() {}
        renderAll() {}
        on() {}
        off() {}
        dispose() {}
        add() {}
        remove() {}
        clear() {}
        getObjects() {
          return [];
        }
        getActiveObject() {
          return null;
        }
        setActiveObject() {}
        getPointer() {
          return { x: 0, y: 0 };
        }
        loadFromJSON() {}
        toJSON() {
          return {};
        }
        setCoords() {}
        getZoom() { return 1; }
        setZoom() {}
        zoomToPoint() {}
        relativePan() {}
        setViewportTransform() {}
        getViewportTransform() { return [1, 0, 0, 1, 0, 0]; }
      },
      Rect: class {},
      IText: class {},
      Point: class {
        constructor(x, y) {
          this.x = x;
          this.y = y;
        }
      }
    };
  })();