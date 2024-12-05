import { useState, useEffect } from 'react';
import { fetchGraphData, fetchRoadGraphData, GraphData } from '../services/api';

export type GraphType = 'full' | 'road';

export interface UseGraphDataReturn {
  graphData: GraphData | null;
  roadGraphData: GraphData | null;
  currentData: GraphData | null;
  activeTab: GraphType;
  setActiveTab: (tab: GraphType) => void;
  error: string | null;
  loadGraphData: () => Promise<void>;
  loadRoadGraphData: () => Promise<void>;
}

export function useGraphData(): UseGraphDataReturn {
  const [activeTab, setActiveTab] = useState<GraphType>('full');
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [roadGraphData, setRoadGraphData] = useState<GraphData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadGraphData = async () => {
    try {
      const data = await fetchGraphData();
      console.log(data);
      setGraphData(data);
    } catch (err) {
      setError('Failed to load graph data');
      console.error('Error loading graph data:', err);
    }
  };

  const loadRoadGraphData = async () => {
    try {
      const data = await fetchRoadGraphData();
      setRoadGraphData(data);
    } catch (err) {
      console.error('Error loading road graph data:', err);
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
    loadGraphData,
    loadRoadGraphData,
  };
}
