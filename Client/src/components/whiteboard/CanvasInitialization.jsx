import { useEffect, useRef } from "react";

export default function useCanvasInitialization({ 
  canvasRef, 
  fabricCanvasRef, 
  isLoadingRef, 
  undoStackRef, 
  redoStackRef, 
  canvasStateRef, 
  tool, 
  color, 
  brushSize, 
  setZoom 
}) {
  const isPanningRef = useRef(false);
  const lastPanPointRef = useRef({ x: 0, y: 0 });

  // Canvas initialization
  useEffect(() => {
    if (!canvasRef.current) return;

    const parent = canvasRef.current.parentElement;
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: parent.clientWidth,
      height: parent.clientHeight - 80,
      backgroundColor: '#ffffff',
      selection: tool === 'select',
      fireRightClick: true
    });

    fabricCanvasRef.current = canvas;

    // Restore canvas state if available
    if (canvasStateRef?.current) {
      try {
        isLoadingRef.current = true;
        const canvasData = JSON.parse(canvasStateRef.current);
        canvas.loadFromJSON(canvasData, () => {
          canvas.backgroundColor = canvasData.backgroundColor || '#ffffff';
          canvas.getObjects().forEach(obj => {
            if (obj.type === 'path' && obj.fill && obj.fill !== 'transparent' && !obj.stroke) {
              obj.set('fill', 'transparent');
              obj.set('stroke', obj.fill);
            }
          });
          canvas.renderAll();
          isLoadingRef.current = false;
        });
      } catch (error) {
        console.error('Error restoring canvas:', error);
        isLoadingRef.current = false;
      }
    }

    // Save initial state
    saveCanvasState();

    // Panning handlers
    const handleMouseDown = (opt) => {
      if (tool === 'move') {
        isPanningRef.current = true;
        canvas.defaultCursor = 'grabbing';
        canvas.selection = false;
        canvas.discardActiveObject();
        lastPanPointRef.current = { x: opt.e.clientX, y: opt.e.clientY };
        opt.e.preventDefault();
        opt.e.stopPropagation();
      }
    };

    const handleMouseMove = (opt) => {
      if (tool === 'move' && isPanningRef.current) {
        const deltaX = opt.e.clientX - lastPanPointRef.current.x;
        const deltaY = opt.e.clientY - lastPanPointRef.current.y;
        
        const vpt = canvas.viewportTransform.slice();
        vpt[4] += deltaX / canvas.getZoom();
        vpt[5] += deltaY / canvas.getZoom();
        canvas.setViewportTransform(vpt);
        
        lastPanPointRef.current = { x: opt.e.clientX, y: opt.e.clientY };
        opt.e.preventDefault();
        opt.e.stopPropagation();
      }
    };

    const handleMouseUp = (opt) => {
      if (tool === 'move' && isPanningRef.current) {
        isPanningRef.current = false;
        canvas.defaultCursor = 'grab';
        canvas.selection = true;
        opt.e.preventDefault();
        opt.e.stopPropagation();
      }
    };

    // Mouse wheel zoom
    canvas.on('mouse:wheel', function(opt) {
      const delta = opt.e.deltaY;
      let zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      setZoom(Math.round(zoom * 100));
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    // Touch gestures for mobile
    let lastTouchDistance = 0;
    let lastTouchCenter = { x: 0, y: 0 };

    canvas.on('touch:gesture', function(e) {
      if (e.e.touches && e.e.touches.length === 2) {
        const touch1 = e.e.touches[0];
        const touch2 = e.e.touches[1];
        
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + 
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        
        const center = {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2
        };

        if (lastTouchDistance > 0) {
          const scale = distance / lastTouchDistance;
          let zoom = canvas.getZoom() * scale;
          if (zoom > 20) zoom = 20;
          if (zoom < 0.01) zoom = 0.01;
          
          canvas.zoomToPoint({ x: center.x, y: center.y }, zoom);
          setZoom(Math.round(zoom * 100));
        }

        lastTouchDistance = distance;
        lastTouchCenter = center;
        e.e.preventDefault();
      }
    });

    canvas.on('touch:end', function() {
      lastTouchDistance = 0;
    });

    // Handle window resize
    const handleResize = () => {
      canvas.setDimensions({
        width: parent.clientWidth,
        height: parent.clientHeight - 80
      });
      canvas.renderAll();
    };

    // Handle canvas restore
    const handleCanvasRestore = () => {
      if (canvasStateRef?.current) {
        try {
          isLoadingRef.current = true;
          const canvasData = JSON.parse(canvasStateRef.current);
          canvas.loadFromJSON(canvasData, () => {
            canvas.backgroundColor = canvasData.backgroundColor || '#ffffff';
            canvas.getObjects().forEach(obj => {
              if (obj.type === 'path' && obj.fill && obj.fill !== 'transparent' && !obj.stroke) {
                obj.set('fill', 'transparent');
                obj.set('stroke', obj.fill);
              }
            });
            canvas.renderAll();
            isLoadingRef.current = false;
          });
        } catch (error) {
          console.error('Error restoring canvas:', error);
          isLoadingRef.current = false;
        }
      }
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    window.addEventListener('resize', handleResize);
    window.addEventListener('canvasRestore', handleCanvasRestore);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('canvasRestore', handleCanvasRestore);
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [tool]);

  // Update canvas settings
  const updateCanvasSettings = () => {
  const canvas = fabricCanvasRef.current;
  if (!canvas) return;

  // Save current pan state
  const vpt = canvas.viewportTransform.slice();

  canvas.isDrawingMode = tool === 'pen';
  canvas.selection = tool === 'select';
  canvas.skipTargetFind = tool === 'move';

  if (tool === 'pen') {
    canvas.freeDrawingBrush.width = brushSize;
    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.fill = 'transparent';
    canvas.defaultCursor = 'crosshair';
    canvas.hoverCursor = 'crosshair';
  } else if (tool === 'select') {
    canvas.defaultCursor = 'default';
    canvas.hoverCursor = 'move';
  } else if (tool === 'move') {
    canvas.defaultCursor = 'grab';
    canvas.hoverCursor = 'grabbing';
  }

  // Restore pan state
  canvas.setViewportTransform(vpt);
};


  useEffect(() => {
    updateCanvasSettings();
  }, [tool, color, brushSize]);

  // Canvas state management
  const saveCanvasState = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || isLoadingRef.current) return;

    const state = JSON.stringify(canvas.toJSON(['id']));
    undoStackRef.current.push(state);
    if (undoStackRef.current.length > 20) {
      undoStackRef.current.shift();
    }
    redoStackRef.current = [];

    if (canvasStateRef) {
      canvasStateRef.current = state;
    }
  };

  // Tool functions
  const addShape = (shapeType) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    let shape;
    const shapeProps = {
      left: 100,
      top: 100,
      fill: 'transparent',
      stroke: color,
      strokeWidth: 2,
      id: `${shapeType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    switch (shapeType) {
      case 'rect':
        shape = new fabric.Rect({ ...shapeProps, width: 100, height: 100 });
        break;
      case 'circle':
        shape = new fabric.Circle({ ...shapeProps, radius: 50 });
        break;
      case 'triangle':
        shape = new fabric.Triangle({ ...shapeProps, width: 100, height: 100 });
        break;
    }

    if (shape) {
      canvas.add(shape);
      canvas.setActiveObject(shape);
    }
  };

  const addText = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const text = new fabric.IText('Click to edit', {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: color,
      id: `text_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
    
    canvas.add(text);
    canvas.setActiveObject(text);
  };

  const deleteSelected = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length) {
      canvas.remove(...activeObjects);
      canvas.discardActiveObject();
    }
  };

  const undo = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || undoStackRef.current.length <= 1) return;

    redoStackRef.current.push(undoStackRef.current.pop());
    const previousState = undoStackRef.current[undoStackRef.current.length - 1];
    
    if (previousState) {
      isLoadingRef.current = true;
      canvas.loadFromJSON(previousState, () => {
        canvas.renderAll();
        isLoadingRef.current = false;
      });
    }
  };

  const clearCanvas = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    canvas.renderAll();
    
    const canvasData = {
      objects: [],
      backgroundColor: '#ffffff',
    };
    if (canvasStateRef) {
      canvasStateRef.current = JSON.stringify(canvasData);
    }
  };

  const resetZoom = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.setZoom(1);
    canvas.absolutePan({ x: 0, y: 0 });
    setZoom(100);
  };

  const zoomIn = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    let zoom = canvas.getZoom() * 1.1;
    if (zoom > 20) zoom = 20;
    canvas.setZoom(zoom);
    setZoom(Math.round(zoom * 100));
  };

  const zoomOut = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    let zoom = canvas.getZoom() * 0.9;
    if (zoom < 0.01) zoom = 0.01;
    canvas.setZoom(zoom);
    setZoom(Math.round(zoom * 100));
  };

  return {
    saveCanvasState,
    addShape,
    addText,
    deleteSelected,
    undo,
    clearCanvas,
    resetZoom,
    zoomIn,
    zoomOut
  };
}