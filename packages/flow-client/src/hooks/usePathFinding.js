// @flow
import { useState } from 'react';
import { findPath } from '../utils/findPath';
import type { GraphData, PathPoints, UsePathFindingReturn } from '../types';

export function usePathFinding(currentData: ?GraphData): UsePathFindingReturn {
  const [selectedPath, setSelectedPath] = useState<?Array<number>>(null);
  const [pathPoints, setPathPoints] = useState<PathPoints>({ start: null, end: null });
  const [error, setError] = useState<?string>(null);

  const handlePathFind = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const startIndex = parseInt(formData.get('startPoint') || '');
    const endIndex = parseInt(formData.get('endPoint') || '');
    
    if (isNaN(startIndex) || isNaN(endIndex)) {
      setError('Please select both start and end points');
      return;
    }
    
    if (!currentData?.nodes) {
      setError('No graph data available');
      return;
    }
    
    if (startIndex < 0 || endIndex < 0 || 
        startIndex >= currentData.nodes.length || 
        endIndex >= currentData.nodes.length) {
      setError('Invalid start or end point');
      return;
    }
    
    const path = findPath(startIndex, endIndex, currentData);
    if (!path) {
      setError('No path found between the selected points');
      return;
    }
    
    setSelectedPath(path);
    setPathPoints({ start: startIndex, end: endIndex });
    setError(null);
  };

  return {
    selectedPath,
    pathPoints,
    error,
    handlePathFind,
  };
}
