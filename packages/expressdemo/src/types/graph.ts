export interface GraphNode {
  x: number;
  y: number;
  label: string;
}

export interface GraphData {
  nodes: GraphNode[];
  lines: number[][];
}
