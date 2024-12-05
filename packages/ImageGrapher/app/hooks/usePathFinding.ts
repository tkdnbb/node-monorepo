import { useState } from 'react';
import { GraphData } from './useGraphData';

interface PathPoints {
  start: number | null;
  end: number | null;
}

function usePathFinding(graphData: GraphData) {
  const [selectedPath, setSelectedPath] = useState<number[] | null>(null);
  const [pathPoints, setPathPoints] = useState<PathPoints>({ start: null, end: null });
  const [error, setError] = useState<string | null>(null);

  const findShortestPath = (startIndex: number, endIndex: number): number[] | null => {
    const nodes = graphData.nodes.length;
    const dist = new Array(nodes).fill(Infinity);
    const prev = new Array(nodes).fill(null);
    const visited = new Set();

    dist[startIndex] = 0;

    while (visited.size < nodes) {
      // Find minimum distance node
      let minDist = Infinity;
      let minNode = null;

      for (let i = 0; i < nodes; i++) {
        if (!visited.has(i) && dist[i] < minDist) {
          minDist = dist[i];
          minNode = i;
        }
      }

      if (minNode === null || minDist === Infinity) {
        break; // No path exists
      }

      visited.add(minNode);

      // If we've reached the end node, construct and return the path
      if (minNode === endIndex) {
        const path = [];
        let current = endIndex;
        while (current !== null) {
          path.unshift(current);
          current = prev[current];
        }
        return path;
      }

      // Update distances to neighbors
      graphData.lines.forEach(([start, end]) => {
        let neighbor = null;
        if (start === minNode) {
          neighbor = end;
        } else if (end === minNode) {
          neighbor = start;
        }

        if (neighbor !== null && !visited.has(neighbor)) {
          const node1 = graphData.nodes[minNode];
          const node2 = graphData.nodes[neighbor];
          const distance = Math.sqrt(
            Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2)
          );
          const alt = dist[minNode] + distance;

          if (alt < dist[neighbor]) {
            dist[neighbor] = alt;
            prev[neighbor] = minNode;
          }
        }
      });
    }

    return null; // No path found
  };

  const handlePathFind = (start: number | null, end: number | null) => {
    setError(null);
    setPathPoints({ start, end });

    if (start === null || end === null) {
      setSelectedPath(null);
      return;
    }

    const path = findShortestPath(start, end);
    if (path) {
      setSelectedPath(path);
    } else {
      setError('No path found between selected points');
      setSelectedPath(null);
    }
  };

  return {
    selectedPath,
    pathPoints,
    error,
    handlePathFind,
  };
}

export default usePathFinding;
