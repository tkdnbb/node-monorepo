// @flow
import * as React from 'react';
import { useState, useEffect } from 'react';
import { GltfViewer } from '../components/GltfViewer';
// $FlowFixMe[cannot-resolve-module]
import floorplanGltf from '../assets/floorplan-1F.gltf';

export default function FloorPlanViewer(): React.Node {
  const [floorPlans, setFloorPlans] = useState<Array<string>>([]);
  const [selectedFloor, setSelectedFloor] = useState<string>('');

  /*useEffect(() => {
    // Fetch available floor plans from your API
    fetch('/api/floorplans')
      .then(res => res.json())
      .then(data => {
        setFloorPlans(data);
        if (data.length > 0) {
          setSelectedFloor(data[0]);
        }
      });
  }, []);*/

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 border-b">
        <select 
          value={selectedFloor} 
          onChange={(e: SyntheticEvent<HTMLSelectElement>) => setSelectedFloor(e.currentTarget.value)}
          className="p-2 border rounded"
          aria-label="Select floor plan"
        >
          {floorPlans.map(floor => (
            <option key={floor} value={floor}>
              {floor}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        {!selectedFloor && (
          <GltfViewer gltfUrl={floorplanGltf} />
        )}
        {selectedFloor && (
          <GltfViewer gltfUrl={`/api/floorplans/${selectedFloor}`} />
        )}
      </div>
    </div>
  );
} 