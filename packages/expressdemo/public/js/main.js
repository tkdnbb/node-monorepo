class MapNavigator {
  constructor() {
    this.canvas = document.getElementById('mapCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.graphData = null;
    this.selectedPath = [];

    this.initializeCanvas();
    this.loadGraphData();
    this.setupEventListeners();
  }

  initializeCanvas() {
    // Set canvas size to match its display size
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  scaleCoordinates() {
    if (!this.graphData || !this.graphData.nodes.length) return;

    // Find the bounds of all coordinates
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    this.graphData.nodes.forEach(node => {
      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
      maxX = Math.max(maxX, node.x);
      maxY = Math.max(maxY, node.y);
    });

    // Add padding
    const padding = 50;
    const scaleX = (this.canvas.width - padding * 2) / (maxX - minX);
    const scaleY = (this.canvas.height - padding * 2) / (maxY - minY);
    const scale = Math.min(scaleX, scaleY);

    // Scale and translate all coordinates
    this.graphData.nodes.forEach(node => {
      node.scaledX = (node.x - minX) * scale + padding;
      node.scaledY = (node.y - minY) * scale + padding;
    });
  }

  async loadGraphData() {
    try {
      const response = await fetch('/api/graph-data');
      this.graphData = await response.json();
      this.scaleCoordinates();  // Scale coordinates after loading
      this.updateLocationSelectors();
      this.drawMap();
    } catch (error) {
      console.error('Error loading graph data:', error);
    }
  }

  updateLocationSelectors() {
    const startSelect = document.getElementById('startPoint');
    const endSelect = document.getElementById('endPoint');

    // Clear existing options
    startSelect.innerHTML = '<option value="">Select Start Point</option>';
    endSelect.innerHTML = '<option value="">Select Destination</option>';

    // Add options for each node
    this.graphData.nodes.forEach((node, index) => {
      const option1 = document.createElement('option');
      const option2 = document.createElement('option');

      option1.value = option2.value = index;
      option1.textContent = option2.textContent = node.label || `Point ${index + 1}`;

      startSelect.appendChild(option1);
      endSelect.appendChild(option2.cloneNode(true));
    });
  }

  drawMap() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw lines
    this.graphData.lines.forEach(([startIdx, endIdx]) => {
      const start = this.graphData.nodes[startIdx];
      const end = this.graphData.nodes[endIdx];

      this.ctx.beginPath();
      this.ctx.moveTo(start.scaledX, start.scaledY);
      this.ctx.lineTo(end.scaledX, end.scaledY);
      this.ctx.strokeStyle = '#666';
      this.ctx.stroke();
    });

    // Draw nodes
    this.graphData.nodes.forEach((node, index) => {
      // Draw node circle
      this.ctx.beginPath();
      this.ctx.arc(node.scaledX, node.scaledY, 5, 0, Math.PI * 2);
      this.ctx.fillStyle = '#007bff';
      this.ctx.fill();

      // Draw node label
      if (node.label) {
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = '#333';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(node.label, node.scaledX, node.scaledY - 10);
      }
    });

    // Draw selected path
    if (this.selectedPath.length > 1) {
      this.ctx.beginPath();
      this.ctx.moveTo(
        this.graphData.nodes[this.selectedPath[0]].scaledX,
        this.graphData.nodes[this.selectedPath[0]].scaledY
      );

      for (let i = 1; i < this.selectedPath.length; i++) {
        const node = this.graphData.nodes[this.selectedPath[i]];
        this.ctx.lineTo(node.scaledX, node.scaledY);
      }

      this.ctx.strokeStyle = '#28a745';
      this.ctx.lineWidth = 3;
      this.ctx.stroke();
      this.ctx.lineWidth = 1;
    }
  }

  findShortestPath(startIndex, endIndex) {
    // Simple Dijkstra's algorithm implementation
    const nodes = this.graphData.nodes.length;
    const dist = new Array(nodes).fill(Infinity);
    const prev = new Array(nodes).fill(null);
    const visited = new Set();

    dist[startIndex] = 0;

    while (visited.size < nodes) {
      // Find minimum distance node
      let minDist = Infinity;
      let minNode = null;

      for (let i = 0; i < nodes; i++) {
        if (!visited.has(i) && dist[i] < minDist) {
          minDist = dist[i];
          minNode = i;
        }
      }

      if (minNode === null) break;
      visited.add(minNode);

      // Check neighbors through edges
      this.graphData.lines.forEach(([from, to]) => {
        if (from === minNode || to === minNode) {
          const neighbor = from === minNode ? to : from;
          const start = this.graphData.nodes[minNode];
          const end = this.graphData.nodes[neighbor];

          // Calculate Euclidean distance
          const distance = Math.sqrt(
            Math.pow(end.x - start.x, 2) +
            Math.pow(end.y - start.y, 2)
          );

          const alt = dist[minNode] + distance;
          if (alt < dist[neighbor]) {
            dist[neighbor] = alt;
            prev[neighbor] = minNode;
          }
        }
      });
    }

    // Reconstruct path
    const path = [];
    let current = endIndex;

    while (current !== null) {
      path.unshift(current);
      current = prev[current];
    }

    return path;
  }

  async processMap(mapData) {
    try {
      const response = await fetch('/api/process-map', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mapData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Map processing result:', result);
      return result;
    } catch (error) {
      console.error('Error processing map:', error);
      throw error;
    }
  }

  setupEventListeners() {
    document.getElementById('findPath').addEventListener('click', () => {
      const startIndex = parseInt(document.getElementById('startPoint').value);
      const endIndex = parseInt(document.getElementById('endPoint').value);

      if (!isNaN(startIndex) && !isNaN(endIndex)) {
        this.selectedPath = this.findShortestPath(startIndex, endIndex);
        this.drawMap();
      }
    });
  }
}

// Test function for the process-map API
async function testProcessMapAPI() {
  try {
    const testData = {
      // Example test data
      nodes: [
        { id: 1, label: "Point A", x: 100, y: 100 },
        { id: 2, label: "Point B", x: 200, y: 200 }
      ],
      edges: [
        { source: 1, target: 2, weight: 1 }
      ]
    };

    const response = await fetch('/api/process-map', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Map processing result:', result);
    return result;
  } catch (error) {
    console.error('Error processing map:', error);
    throw error;
  }
}

// You can test the API by calling this function from the browser console
window.testProcessMapAPI = testProcessMapAPI;

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
  window.mapNavigator = new MapNavigator();
});
