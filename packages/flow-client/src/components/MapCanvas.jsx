import { useEffect, useRef, useState, useCallback } from 'react';
import { Slider } from "./ui/slider";

// Debounce utility function
const debounce = (fn, ms) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
};

export default function MapCanvas({ graphData, selectedPath, pathPoints }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Calculate the scaled coordinates and bounds of the graph
  const calculateScaledCoordinates = useCallback((nodes, width, height) => {
    if (!nodes?.length) return { scaledNodes: [], bounds: null };

    // Find bounds
    const bounds = nodes.reduce((acc, node) => ({
      minX: Math.min(acc.minX, node.x),
      minY: Math.min(acc.minY, node.y),
      maxX: Math.max(acc.maxX, node.x),
      maxY: Math.max(acc.maxY, node.y)
    }), {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity
    });

    // Add padding (10%)
    const rangeX = bounds.maxX - bounds.minX;
    const rangeY = bounds.maxY - bounds.minY;
    const paddingX = rangeX * 0.1;
    const paddingY = rangeY * 0.1;

    bounds.minX -= paddingX;
    bounds.maxX += paddingX;
    bounds.minY -= paddingY;
    bounds.maxY += paddingY;

    // Calculate scale to fit
    const scaleX = width / (bounds.maxX - bounds.minX);
    const scaleY = height / (bounds.maxY - bounds.minY);
    const baseScale = Math.min(scaleX, scaleY);

    // Scale coordinates
    const scaledNodes = nodes.map(node => ({
      ...node,
      scaledX: (node.x - bounds.minX) * baseScale,
      scaledY: (node.y - bounds.minY) * baseScale
    }));

    return { scaledNodes, bounds, baseScale };
  }, []);

  // Handle canvas resize with debounce
  const handleResize = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return;
    
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const rect = container.getBoundingClientRect();
    
    const newWidth = Math.floor(rect.width);
    const newHeight = Math.floor(rect.height || 600);

    // Only update if dimensions actually changed
    if (dimensions.width !== newWidth || dimensions.height !== newHeight) {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = newWidth * dpr;
      canvas.height = newHeight * dpr;
      canvas.style.width = `${newWidth}px`;
      canvas.style.height = `${newHeight}px`;
      
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      
      console.log('Current NODE_ENV:', process.env.NODE_ENV);
      console.log(`Canvas resized to ${newWidth}x${newHeight} with DPR ${dpr}`);
      setDimensions({ width: newWidth, height: newHeight });
    }
  }, [dimensions]);

  // Debounced resize handler
  const debouncedResize = useCallback(debounce(handleResize, 100), [handleResize]);

  // Draw the graph
  const drawGraph = useCallback((ctx, scaledNodes, lines, path) => {
    if (!scaledNodes?.length) return;

    // Enable antialiasing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw lines
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    lines?.forEach(([startIdx, endIdx]) => {
      const start = scaledNodes[startIdx];
      const end = scaledNodes[endIdx];
      
      ctx.beginPath();
      ctx.moveTo(start.scaledX * scale, start.scaledY * scale);
      ctx.lineTo(end.scaledX * scale, end.scaledY * scale);
      ctx.stroke();
    });

    // Draw selected path
    if (path?.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#28a745';
      ctx.lineWidth = 3;
      
      const start = scaledNodes[path[0]];
      ctx.moveTo(start.scaledX * scale, start.scaledY * scale);
      
      for (let i = 1; i < path.length; i++) {
        const node = scaledNodes[path[i]];
        ctx.lineTo(node.scaledX * scale, node.scaledY * scale);
      }
      ctx.stroke();
    }

    // Draw nodes
    scaledNodes.forEach((node, index) => {
      // Determine node color based on whether it's start, end, or regular node
      let nodeColor = '#007bff'; // default blue
      let nodeSize = 5;

      if (pathPoints?.start === index) {
        nodeColor = '#28a745'; // green for start
        nodeSize = 7;
      } else if (pathPoints?.end === index) {
        nodeColor = '#dc3545'; // red for destination
        nodeSize = 7;
      }

      // Node circle
      ctx.beginPath();
      ctx.fillStyle = nodeColor;
      ctx.arc(node.scaledX * scale, node.scaledY * scale, nodeSize, 0, Math.PI * 2);
      ctx.fill();

      // Node label
      if (node.label) {
        ctx.font = '12px Arial';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(node.label, node.scaledX * scale, node.scaledY * scale - 8);
      }
    });
  }, [scale, pathPoints]);

  // Main render effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = dimensions;

    // Clear canvas
    ctx.clearRect(0, 0, width * (window.devicePixelRatio || 1), height * (window.devicePixelRatio || 1));

    if (graphData?.nodes) {
      const { scaledNodes } = calculateScaledCoordinates(graphData.nodes, width, height);
      drawGraph(ctx, scaledNodes, graphData.lines, selectedPath);
    }
  }, [graphData, selectedPath, dimensions, scale, calculateScaledCoordinates, drawGraph]);

  // Setup resize observer
  useEffect(() => {
    if (!containerRef.current) return;

    // Initial size setup
    handleResize();

    // Setup resize observer
    const resizeObserver = new ResizeObserver(debouncedResize);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [debouncedResize, handleResize]);

  // Handle zoom change
  const handleZoomChange = useCallback((value) => {
    setScale(value[0]);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[800px] min-h-[800px] pt-3">
      <div className="absolute top-4 right-4 flex items-center gap-4 bg-white p-4 rounded-lg shadow-md z-10">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">Zoom:</span>
          <span className="min-w-[3ch] text-sm text-slate-600">{Math.round(scale * 100)}%</span>
        </div>
        <Slider
          value={[scale]}
          onValueChange={handleZoomChange}
          min={0.5}
          max={2}
          step={0.1}
          className="w-32"
        />
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-full border border-gray-200 rounded-lg bg-white"
      />
    </div>
  );
}
