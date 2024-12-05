// @flow

export type Node = {
  x: number,
  y: number,
  label?: string,
  scaledX?: number,
  scaledY?: number
};

export type Line = [number, number];

export type GraphData = {
  nodes: Array<Node>,
  lines: Array<Line>,
  nodesList?: Array<Array<Node>>
};

export type GraphType = 'full' | 'road';

export type PathPoints = {
  start: ?number,
  end: ?number
};

export type UseFileUploadProps = {
  activeTab: GraphType,
  onUploadSuccess: (data: GraphData) => void
};

export type UseGraphDataReturn = {
  graphData: ?GraphData,
  roadGraphData: ?GraphData,
  currentData: ?GraphData,
  activeTab: GraphType,
  setActiveTab: (tab: GraphType) => void,
  error: ?string,
  loadGraphData: () => Promise<void>,
  loadRoadGraphData: () => Promise<void>
};

export type UsePathFindingReturn = {
  selectedPath: ?Array<number>,
  pathPoints: PathPoints,
  error: ?string,
  handlePathFind: (e: SyntheticEvent<HTMLFormElement>) => void
};

export type MapCanvasProps = {
  graphData: GraphData,
  selectedPath: ?Array<number>,
  pathPoints: PathPoints
};

export type PathFindingFormProps = {
  currentData: GraphData,
  onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void
};
