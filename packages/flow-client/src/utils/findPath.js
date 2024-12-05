// @flow
import { PriorityQueue } from './PriorityQueue';
import type { GraphData } from '../types';

export function findPath(
  startIndex: number,
  endIndex: number,
  graphData: ?GraphData
): ?Array<number> {
  if (!graphData || startIndex === endIndex) {
    return startIndex === endIndex ? [startIndex] : null;
  }

  const nodes = graphData.nodes.length;
  const distances: Array<number> = new Array(nodes).fill(Infinity);
  const previous: Array<?number> = new Array(nodes).fill(null);
  const pq = new PriorityQueue();

  // Initialize distances
  distances[startIndex] = 0;
  pq.enqueue(startIndex, 0);

  // Create adjacency list for faster neighbor lookup
  const adjacencyList: Array<Array<number>> = new Array(nodes).fill(null).map(() => []);
  graphData.lines.forEach(([from, to]) => {
    adjacencyList[from].push(to);
    adjacencyList[to].push(from);
  });

  while (pq.values.length) {
    const currentNode = pq.dequeue();
    if (!currentNode) break;
    
    const current = currentNode.val;
    if (current === endIndex) {
      break;
    }

    // Process neighbors
    for (const neighbor of adjacencyList[current]) {
      const start = graphData.nodes[current];
      const end = graphData.nodes[neighbor];

      // Calculate Euclidean distance
      const distance = Math.sqrt(
        Math.pow(end.x - start.x, 2) + 
        Math.pow(end.y - start.y, 2)
      );

      const totalDistance = distances[current] + distance;

      if (totalDistance < distances[neighbor]) {
        distances[neighbor] = totalDistance;
        previous[neighbor] = current;
        pq.enqueue(neighbor, totalDistance);
      }
    }
  }

  // Reconstruct path
  if (distances[endIndex] === Infinity) {
    return null; // No path exists
  }

  const path = [];
  let current: ?number = endIndex;

  while (current != null) {
    path.unshift(current);
    current = previous[current];
  }

  return path;
}
