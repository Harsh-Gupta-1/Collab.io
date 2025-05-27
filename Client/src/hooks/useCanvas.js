import { useEffect, useRef, useState } from "react";
import { TOOLS } from "../utils/constants";

export function useCanvas(containerRef, color, tool, canvasId, onSync) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const skipSync = useRef(false);
  const lastTouchDistance = useRef(0);
  const isPanning = useRef(false);
  const lastPanPoint = useRef({ x: 0, y: 0 });
  const lastActivityRef = useRef(Date.now());
  const canvasStateRef = useRef(null);

  useEffect(() => {
    if (!window.fabric || !containerRef.current) {
      console.error("Fabric.js or container not available");
      return;
    }

    const canvasElement = document.getElementById(canvasId);
    if (!canvasElement) {
      console.error(`Canvas element with ID ${canvasId} not found`);
      return;
    }

    const canvas = new window.fabric.Canvas(canvasId, {
      backgroundColor: "#ffffff",
      selection: true,
      preserveObjectStacking: true,
    });
    canvasRef.current = canvas;

    const updateSize = () => {
      if (containerRef.current && canvasRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        canvas.setWidth(rect.width);
        canvas.setHeight(rect.height);
        canvasElement.style.width = `${rect.width}px`;
        canvasElement.style.height = `${rect.height}px`;
        canvas.renderAll();
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    if (canvasStateRef.current) {
      try {
        canvas.loadFromJSON(canvasStateRef.current, () => {
          canvas.getObjects().forEach((obj) => {
            obj.set({ id: obj.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` });
          });
          canvas.renderAll();
        });
      } catch (error) {
        console.error("Error restoring canvas state:", error);
      }
    }

    canvas.isDrawingMode = tool === TOOLS.PENCIL;
    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = 3;

    const handleWheel = (opt) => {
      const delta = opt.e.deltaY;
      let zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      const point = new window.fabric.Point(opt.e.offsetX, opt.e.offsetY);
      canvas.zoomToPoint(point, zoom);
      setZoom(zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        lastTouchDistance.current = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );

        if (lastTouchDistance.current > 0) {
          const scale = distance / lastTouchDistance.current;
          let zoom = canvas.getZoom();
          zoom *= scale;
          if (zoom > 20) zoom = 20;
          if (zoom < 0.01) zoom = 0.01;
          const centerX = (touch1.clientX + touch2.clientX) / 2;
          const centerY = (touch1.clientY + touch2.clientY) / 2;
          const rect = canvasElement.getBoundingClientRect();
          const point = new window.fabric.Point(centerX - rect.left, centerY - rect.top);
          canvas.zoomToPoint(point, zoom);
          setZoom(zoom);
        }
        lastTouchDistance.current = distance;
      }
    };

    canvas.on("mouse:wheel", handleWheel);
    canvasElement.addEventListener("touchstart", handleTouchStart);
    canvasElement.addEventListener("touchmove", handleTouchMove);

    canvas.on("object:added", () => !skipSync.current && onSync("add", canvas.getActiveObject()?.toObject()));
    canvas.on("object:modified", () => !skipSync.current && onSync("modify", canvas.getActiveObject()?.toObject()));
    canvas.on("object:removed", () => !skipSync.current && onSync("remove", null, canvas.getActiveObject()?.id));

    canvas.on("mouse:move", () => {
      lastActivityRef.current = Date.now();
    });

    canvas.on("mouse:down", () => {
      lastActivityRef.current = Date.now();
    });

    canvas.on("mouse:dblclick", (opt) => {
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === "i-text") {
        activeObject.enterEditing();
        activeObject.selectAll();
      }
    });

    return () => {
      window.removeEventListener("resize", updateSize);
      canvasElement.removeEventListener("touchstart", handleTouchStart);
      canvasElement.removeEventListener("touchmove", handleTouchMove);
      canvas.off("mouse:wheel");
      canvas.off("object:added");
      canvas.off("object:modified");
      canvas.off("object:removed");
      canvas.off("mouse:move");
      canvas.off("mouse:down");
      canvas.off("mouse:dblclick");
      canvas.dispose();
      canvasRef.current = null;
    };
  }, [canvasId, containerRef, color, tool, onSync]);

  return {
    canvasRef,
    isDrawing,
    setIsDrawing,
    zoom,
    setZoom,
    skipSync,
    isPanning,
    lastPanPoint,
    lastActivityRef,
    canvasStateRef,
  };
}