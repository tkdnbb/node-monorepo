export interface Node {
  id: number;
  x: number;
  y: number;
  label?: string;
}

export interface Edge {
  source: number;
  target: number;
  weight?: number;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
  imageUrl?: string;
}

const API_BASE_URL = '';  // Empty string for same-origin requests

export const fetchGraphData = async (): Promise<GraphData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/graph-data`);
    if (!response.ok) {
      throw new Error('Failed to fetch graph data');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Failed to load graph data');
  }
};

export const fetchRoadGraphData = async (): Promise<GraphData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/road-graph-data`);
    if (!response.ok) {
      throw new Error('Failed to fetch road graph data');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Failed to load road graph data');
  }
};

export const uploadMapImage = async (file: File, maxContain: number = 2): Promise<GraphData> => {
  if (!file) {
    throw new Error('Please select a file');
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('maxContain', maxContain.toString());

  try {
    const response = await fetch(`${API_BASE_URL}/api/process-map`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Upload failed');
  }
};

export const uploadRoadMapImage = async (file: File, maxContain: number = 2): Promise<GraphData> => {
  if (!file) {
    throw new Error('Please select a file');
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('maxContain', maxContain.toString());

  try {
    const response = await fetch(`${API_BASE_URL}/api/process-road-map`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Upload failed');
  }
};
