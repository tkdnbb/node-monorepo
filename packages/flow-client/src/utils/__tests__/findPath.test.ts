import { findPath } from '../findPath.js';

describe('findPath', () => {
  const sampleGraphData = {
    nodes: [
      { x: 0, y: 0 },   // 0
      { x: 1, y: 0 },   // 1
      { x: 0, y: 1 },   // 2
      { x: 1, y: 1 },   // 3
    ],
    lines: [[0, 1], [1, 3], [0, 2], [2, 3]] as [number, number][]
  };

  it('should return null when graphData is null', () => {
    expect(findPath(0, 1, null)).toBeNull();
  });

  it('should return [startIndex] when start and end are the same', () => {
    expect(findPath(1, 1, sampleGraphData)).toEqual([1]);
  });

  it('should find direct path between adjacent nodes', () => {
    expect(findPath(0, 1, sampleGraphData)).toEqual([0, 1]);
  });

  it('should find path requiring multiple hops', () => {
    const path = findPath(0, 3, sampleGraphData);
    
    // Make sure we got a valid path back
    expect(path).toBeTruthy();
    
    // Path should be at least 3 nodes long since we need to hop through another node
    expect(path?.length).toBeGreaterThan(2);
    
    // Path should start at node 0 and end at node 3
    expect(path?.[0]).toBe(0);
    expect(path?.[path.length - 1]).toBe(3);
    
    // For each pair of nodes in our path, check if they're actually connected by a line
    // For example, if part of our path is [0,1], we need to make sure there's a line between nodes 0 and 1
    for (let i = 0; i < path!.length - 1; i++) {
      const currentNode = path![i];
      const nextNode = path![i + 1];
      
      // Look through all the lines to find if these two nodes are connected
      const nodesAreConnected = sampleGraphData.lines.some(
        ([from, to]) => 
          (from === currentNode && to === nextNode) ||
          (to === currentNode && from === nextNode)
      );
      
      expect(nodesAreConnected).toBe(true);
    }
  });

  it('should handle non-existent paths', () => {
    const disconnectedGraph = {
      nodes: [
        { x: 0, y: 0 },
        { x: 1, y: 1 }
      ],
      lines: [] as [number, number][]
    };
    expect(findPath(0, 1, disconnectedGraph)).toBeNull();
  });
});
