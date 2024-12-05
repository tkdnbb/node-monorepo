// @flow
import React from 'react';
import type { GraphData } from '../types';

type Props = {
  currentData: GraphData,
  onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void,
};

export function PathFindingForm({ currentData, onSubmit }: Props): React$Node {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Find Path</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startPoint" className="block text-sm font-medium text-gray-700 mb-1">
              Start Point
            </label>
            <select
              id="startPoint"
              name="startPoint"
              className="input-field w-full"
              required
            >
              <option value="">Select Start Point</option>
              {currentData.nodes.map((node, index) => (
                <option key={`start-${index}`} value={index}>
                  {node.label || `Point ${index + 1}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="endPoint" className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <select
              id="endPoint"
              name="endPoint"
              className="input-field w-full"
              required
            >
              <option value="">Select Destination</option>
              {currentData.nodes.map((node, index) => (
                <option key={`end-${index}`} value={index}>
                  {node.label || `Point ${index + 1}`}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Find Path
        </button>
      </form>
    </div>
  );
}
