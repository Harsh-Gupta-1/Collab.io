import { useEffect, useRef, useState } from "react";
import { getSocket } from "../sockets/socket";
import { debounce } from 'lodash';

export default function Whiteboard({ roomId, canvasStateRef }) {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const socketRef = useRef(null);
  const isLoadingRef = useRef(false);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(2);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const parent = canvasRef.current.parentElement;
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: parent.clientWidth,
      height: parent.clientHeight,
      backgroundColor: '#ffffff',
      selection: tool === 'select'
    });

    fabricCanvasRef.current = canvas;
    socketRef.current = getSocket();

    // Restore canvas state if available
    if (canvasStateRef?.current) {
      try {
        isLoadingRef.current = true;
        const canvasData = JSON.parse(canvasStateRef.current);
        canvas.loadFromJSON(canvasData, () => {
          canvas.backgroundColor = canvasData.backgroundColor || '#ffffff';
          canvas.renderAll();
          isLoadingRef.current = false;
        });
      } catch (error) {
        console.error('Error restoring canvas:', error);
        isLoadingRef.current = false;
      }
    }

    // Set initial drawing mode
    canvas.isDrawingMode = tool === 'pen';
    canvas.freeDrawingBrush.width = brushSize;
    canvas.freeDrawingBrush.color = color;

    // Enhanced object data optimization with proper path handling
    const optimizeObjectData = (obj) => {
      const baseData = {
        type: obj.type,
        id: obj.id,
        left: obj.left,
        top: obj.top
      };

      switch (obj.type) {
        case 'path':
          return {
            ...baseData,
            path: obj.path,
            stroke: obj.stroke,
            strokeWidth: obj.strokeWidth,
            fill: obj.fill || 'transparent', // Ensure paths don't get filled
            pathOffset: obj.pathOffset,
            scaleX: obj.scaleX,
            scaleY: obj.scaleY,
            angle: obj.angle
          };
        case 'rect':
          return {
            ...baseData,
            width: obj.width,
            height: obj.height,
            fill: obj.fill,
            stroke: obj.stroke,
            strokeWidth: obj.strokeWidth,
            scaleX: obj.scaleX,
            scaleY: obj.scaleY,
            angle: obj.angle
          };
        case 'circle':
          return {
            ...baseData,
            radius: obj.radius,
            fill: obj.fill,
            stroke: obj.stroke,
            strokeWidth: obj.strokeWidth,
            scaleX: obj.scaleX,
            scaleY: obj.scaleY,
            angle: obj.angle
          };
        case 'i-text':
          return {
            ...baseData,
            text: obj.text,
            fill: obj.fill,
            fontSize: obj.fontSize,
            fontFamily: obj.fontFamily,
            scaleX: obj.scaleX,
            scaleY: obj.scaleY,
            angle: obj.angle
          };
        default:
          // Fallback to full object serialization but ensure proper fill handling
          const fullObj = obj.toObject(['id']);
          if (obj.type === 'path' && !fullObj.fill) {
            fullObj.fill = 'transparent';
          }
          return fullObj;
      }
    };

    // Enhanced object creation from data
    const createObjectFromData = (objData, callback) => {
      switch (objData.type) {
        case 'path':
          // Ensure path objects maintain stroke appearance
          const pathObj = new fabric.Path(objData.path, {
            ...objData,
            fill: objData.fill === undefined ? 'transparent' : objData.fill
          });
          callback(pathObj);
          break;
        case 'rect':
          const rectObj = new fabric.Rect(objData);
          callback(rectObj);
          break;
        case 'circle':
          const circleObj = new fabric.Circle(objData);
          callback(circleObj);
          break;
        case 'i-text':
          const textObj = new fabric.IText(objData.text || '', objData);
          callback(textObj);
          break;
        default:
          // Use fabric's enlivenObjects for complex objects
          fabric.util.enlivenObjects([objData], (objects) => {
            if (objects && objects[0]) {
              // Ensure paths don't get filled unexpectedly
              if (objects[0].type === 'path' && objData.fill === 'transparent') {
                objects[0].set('fill', 'transparent');
              }
              callback(objects[0]);
            }
          });
          break;
      }
    };

    // Socket event handlers
    const handleWhiteboardUpdate = ({ data }) => {
      if (isLoadingRef.current) return;
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      if (data.type === 'full-sync') {
        isLoadingRef.current = true;
        canvas.loadFromJSON(data.canvasData, () => {
          // Ensure all path objects maintain proper styling after sync
          canvas.getObjects().forEach(obj => {
            if (obj.type === 'path' && obj.fill !== 'transparent' && !obj.stroke) {
              obj.set('fill', 'transparent');
              obj.set('stroke', obj.fill || '#000000');
            }
          });
          canvas.renderAll();
          isLoadingRef.current = false;
        });
      } else if (data.type === 'object-added' && data.object) {
        const existing = canvas.getObjects().find(o => o.id === data.object.id);
        if (!existing) {
          createObjectFromData(data.object, (newObj) => {
            newObj.id = data.object.id;
            canvas.add(newObj);
            canvas.renderAll();
          });
        }
      } else if (data.type === 'object-modified' && data.object) {
        const obj = canvas.getObjects().find(o => o.id === data.object.id);
        if (obj) {
          // Preserve the object type-specific properties during modification
          const updateProps = { ...data.object };
          delete updateProps.type; // Don't change the object type
          obj.set(updateProps);
          canvas.renderAll();
        }
      } else if (data.type === 'object-removed' && data.objectId) {
        const obj = canvas.getObjects().find(o => o.id === data.objectId);
        if (obj) {
          canvas.remove(obj);
          canvas.renderAll();
        }
      } else if (data.type === 'clear') {
        canvas.clear();
        canvas.backgroundColor = '#ffffff';
        canvas.renderAll();
      }
    };

    // Canvas event handlers
    const handleObjectAdded = debounce((e) => {
      if (isLoadingRef.current) return;
      const obj = e.target;
      if (!obj.id) {
        obj.id = `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }
      
      // Ensure drawing paths have proper styling
      if (obj.type === 'path' && !obj.stroke && obj.fill) {
        obj.set('stroke', obj.fill);
        obj.set('fill', 'transparent');
      }

      socketRef.current?.emit('whiteboard-update', {
        roomId,
        data: {
          type: 'object-added',
          object: optimizeObjectData(obj)
        }
      });
    }, 100);

    const handleObjectModified = debounce((e) => {
      if (isLoadingRef.current) return;
      const obj = e.target;
      socketRef.current?.emit('whiteboard-update', {
        roomId,
        data: {
          type: 'object-modified',
          object: optimizeObjectData(obj)
        }
      });
    }, 100);

    const handleObjectRemoved = (e) => {
      if (isLoadingRef.current) return;
      const obj = e.target;
      socketRef.current?.emit('whiteboard-update', {
        roomId,
        data: {
          type: 'object-removed',
          objectId: obj.id
        }
      });
    };

    // Attach event listeners
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:removed', handleObjectRemoved);
    socketRef.current?.on('whiteboard-update', handleWhiteboardUpdate);

    // Handle window resize
    const handleResize = () => {
      canvas.setDimensions({
        width: parent.clientWidth,
        height: parent.clientHeight
      });
      canvas.renderAll();
    };

    // Handle canvas restore from state
    const handleCanvasRestore = () => {
      if (canvasStateRef?.current) {
        try {
          isLoadingRef.current = true;
          const canvasData = JSON.parse(canvasStateRef.current);
          canvas.loadFromJSON(canvasData, () => {
            canvas.backgroundColor = canvasData.backgroundColor || '#ffffff';
            // Fix any path objects that might have incorrect styling
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

    window.addEventListener('resize', handleResize);
    window.addEventListener('canvasRestore', handleCanvasRestore);

    return () => {
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:removed', handleObjectRemoved);
      socketRef.current?.off('whiteboard-update', handleWhiteboardUpdate);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('canvasRestore', handleCanvasRestore);
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [roomId]);

  // Update tool settings
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = tool === 'pen';
    canvas.selection = tool === 'select';

    if (tool === 'pen') {
      canvas.freeDrawingBrush.width = brushSize;
      canvas.freeDrawingBrush.color = color;
      // Ensure the brush creates stroked paths, not filled ones
      canvas.freeDrawingBrush.fill = 'transparent';
    }

    if (tool === 'pen') {
      canvas.defaultCursor = 'crosshair';
      canvas.hoverCursor = 'crosshair';
    } else if (tool === 'select') {
      canvas.defaultCursor = 'default';
      canvas.hoverCursor = 'move';
    } else if (tool === 'eraser') {
      canvas.defaultCursor = 'crosshair';
      canvas.hoverCursor = 'crosshair';
    }
  }, [tool, color, brushSize]);

  // Tool functions
  const addRectangle = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: 'transparent',
      stroke: color,
      strokeWidth: 2,
      id: `rect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
    
    canvas.add(rect);
    canvas.setActiveObject(rect);
  };

  const addCircle = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const circle = new fabric.Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: 'transparent',
      stroke: color,
      strokeWidth: 2,
      id: `circle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
    
    canvas.add(circle);
    canvas.setActiveObject(circle);
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
    socketRef.current?.emit('whiteboard-update', {
      roomId,
      data: { type: 'clear' }
    });
  };

  const syncCanvas = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const canvasData = {
      objects: canvas.getObjects().map(obj => optimizeObjectData(obj)),
      backgroundColor: canvas.backgroundColor
    };

    if (canvasStateRef) {
      canvasStateRef.current = JSON.stringify(canvasData);
    }

    socketRef.current?.emit('whiteboard-update', {
      roomId,
      data: {
        type: 'full-sync',
        canvasData
      }
    });
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-white">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-3 shadow-lg flex items-center gap-3">
          <div className="flex items-center gap-2 pr-3 border-r border-gray-200">
            <button
              onClick={() => setTool('select')}
              className={`p-2 rounded-lg transition-colors ${tool === 'select' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
              title="Select"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </button>
            <button
              onClick={() => setTool('pen')}
              className={`p-2 rounded-lg transition-colors ${tool === 'pen' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
              title="Pen"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2 pr-3 border-r border-gray-200">
            <button
              onClick={addRectangle}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Rectangle"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth={2} />
              </svg>
            </button>
            <button
              onClick={addCircle}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Circle"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth={2} />
              </svg>
            </button>
            <button
              onClick={addText}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Text"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h4a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 006.586 3H7a2 2 0 012 2v2M7 21l3-3M7 21l-4-4m4 4V9a2 2 0 012-2h2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2M9 7h6" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2 pr-3 border-r border-gray-200">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
              title="Color"
            />
          </div>
          {tool === 'pen' && (
            <div className="flex items-center gap-2 pr-3 border-r border-gray-200">
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-16"
                title="Brush Size"
              />
              <span className="text-xs text-gray-600 w-6">{brushSize}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={deleteSelected}
              className="p-2 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors"
              title="Delete Selected"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button
              onClick={clearCanvas}
              className="p-2 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors"
              title="Clear All"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h8.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            <button
              onClick={syncCanvas}
              className="p-2 rounded-lg hover:bg-green-100 hover:text-green-600 transition-colors"
              title="Sync Canvas"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}