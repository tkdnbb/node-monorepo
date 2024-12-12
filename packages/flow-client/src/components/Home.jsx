// @flow
import React from 'react';
import { type Node } from 'react';
import { useGraphData } from '../hooks/useGraphData';
import { useFileUpload } from '../hooks/useFileUpload';
import { usePathFinding } from '../hooks/usePathFinding';
import MapCanvas from './MapCanvas';
import { PathFindingForm } from './PathFindingForm';
import type { GraphData, PathPoints } from '../types';

export default function Home(): Node {
  const {
    currentData,
    activeTab,
    setActiveTab,
    loadGraphData,
    loadRoadGraphData
  } = useGraphData();

  const {
    file,
    loading,
    error: uploadError,
    maxContain,
    setMaxContain,
    handleFileChange,
    handleUpload,
  } = useFileUpload({
    activeTab,
    onUploadSuccess: (data: GraphData) => {
      if (activeTab === 'full') {
        loadGraphData();
      } else {
        loadRoadGraphData();
      }
    },
  });

  const {
    selectedPath,
    pathPoints,
    error: pathError,
    handlePathFind,
  } = usePathFinding(currentData);

  const error: ?string = uploadError || pathError;

  return (
    <div className="min-h-screen min-w-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Tokyo International Exhibition Center Navigator
          </h1>
        </header>

        <main>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('full')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'full'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
                type="button"
              >
                Full Graph
              </button>
              <button
                onClick={() => setActiveTab('road')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'road'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
                type="button"
              >
                Road Graph
              </button>
            </div>

            <h2 className="text-xl font-semibold mb-4">Upload Floor Plan</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  disabled={loading}
                  className="input-field w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="maxContain">Max Contain: </label>
                <input
                  type="number"
                  id="maxContain"
                  value={maxContain}
                  onChange={(e: SyntheticInputEvent<HTMLInputElement>) => 
                    setMaxContain(parseInt(e.currentTarget.value) || 2)
                  }
                  min="1"
                  disabled={loading}
                  className="input-field w-full"
                />
              </div>
              <button
                type="submit"
                disabled={!file || loading}
                className="btn btn-primary"
              >
                {loading ? 'Uploading...' : 'Upload'}
              </button>
            </form>
            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            {!currentData ? (
              <div className="h-[600px] w-full flex items-center justify-center text-gray-500">
                Upload a floor plan to view the map
              </div>
            ) : (
              <MapCanvas 
                graphData={currentData} 
                selectedPath={selectedPath}
                pathPoints={pathPoints}
              />
            )}
          </div>

          {currentData && (
            <PathFindingForm
              currentData={currentData}
              onSubmit={handlePathFind}
            />
          )}
        </main>
      </div>
    </div>
  );
} 