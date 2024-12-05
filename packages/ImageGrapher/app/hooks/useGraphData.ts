import { useState, useEffect } from 'react';
import { fetchGraphData, fetchRoadGraphData } from '../services/api';

export interface Node {
  id: number;
  x: number;
  y: number;
  label?: string;
}

export interface GraphData {
  nodes: Node[];
  lines: [number, number][];
}

export type GraphType = 'full' | 'road';

export interface UseGraphDataReturn {
  graphData: GraphData | null;
  roadGraphData: GraphData | null;
  currentData: GraphData | null;
  activeTab: GraphType;
  setActiveTab: (tab: GraphType) => void;
  error: string | null;
  loading: boolean;
  loadGraphData: () => Promise<void>;
  loadRoadGraphData: () => Promise<void>;
}

function useGraphData(): UseGraphDataReturn {
  const [activeTab, setActiveTab] = useState<GraphType>('full');
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [roadGraphData, setRoadGraphData] = useState<GraphData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadGraphData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchGraphData();
      setGraphData(data);
    } catch (err) {
      setError('Failed to load graph data');
    } finally {
      setLoading(false);
    }
  };

  const loadRoadGraphData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRoadGraphData();
      console.log('Road graph data:', data);
      setRoadGraphData(data);
    } catch (err) {
      setError('Failed to load road graph data');
      console.error('Error loading road graph data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGraphData();
    loadRoadGraphData();
  }, []);

  const currentData = activeTab === 'full' ? graphData : roadGraphData;

  return {
    graphData,
    roadGraphData,
    currentData,
    activeTab,
    setActiveTab,
    error,
    loading,
    loadGraphData,
    loadRoadGraphData,
  };
}

export default useGraphData;
