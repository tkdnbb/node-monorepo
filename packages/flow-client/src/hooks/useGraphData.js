// @flow
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchGraphData, fetchRoadGraphData } from '../services/api';
import type { GraphData, GraphType, UseGraphDataReturn } from '../types';

export function useGraphData(): UseGraphDataReturn {
  const [activeTab, setActiveTab] = useState<GraphType>('full');

  const {
    data: graphData,
    error: graphError,
    refetch: loadGraphData,
  } = useQuery({
    queryKey: ['graphData'],
    queryFn: fetchGraphData,
  });

  const {
    data: roadGraphData,
    error: roadError,
    refetch: loadRoadGraphData,
  } = useQuery({
    queryKey: ['roadGraphData'],
    queryFn: fetchRoadGraphData,
  });

  const error = graphError?.message || roadError?.message || null;
  const currentData: ?GraphData = activeTab === 'full' ? graphData : roadGraphData;

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
