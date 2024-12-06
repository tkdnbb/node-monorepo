# Node Monorepo

A Node.js monorepo containing multiple packages, with a focus on graph-based image processing and visualization using the nodegrapher library. The project demonstrates how to build web applications that can transform images into spatial graph data.

## Project Structure

```
node-monorepo/
├── packages/
│   ├── expressdemo/           # Express.js API server with nodegrapher integration
│   ├── expressdemo-tsclient/  # TypeScript client for the Express demo
│   └── flow-client/          # Flow client application
├── package.json              # Root package.json for workspace management
└── LICENSE                   # BSD 2-Clause License
```

## Main Features

- **Image to Graph Transformation**: Convert images into graph structures using nodegrapher
- **Road Network Extraction**: Generate road-like graph networks from images
- **REST API**: Express.js backend with endpoints for image processing
- **TypeScript Support**: Full TypeScript implementation for type safety
- **Monorepo Structure**: Efficient management of multiple related packages

## Packages

### expressdemo

An Express.js server that provides REST APIs for image processing using nodegrapher. Key features:

- Image upload and processing
- Graph data extraction
- Road network generation
- Duplicate image detection
- File management with MD5 hashing

#### API Endpoints:

- `POST /api/process-map`: Process an image to extract full graph data
- `POST /api/process-road`: Process an image to extract road network data
- `GET /api/graph-data`: Retrieve stored graph data
- `GET /api/road-graph-data`: Retrieve stored road graph data

### expressdemo-tsclient

A TypeScript client implementation for interacting with the Express demo server.

### flow-client

A client application implementing flow-based functionality.

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd node-monorepo
```

2. Install dependencies for all packages:
```bash
npm install
```

## Available Scripts

From the root directory:

```bash
# Run the Express demo application
npm run expressdemo

# Run the Flow client application
npm run flow-client
```

## Development

This project uses npm workspaces to manage multiple packages. Each package in the `packages/` directory is treated as a separate npm package but shares dependencies and can be managed from the root directory.

### Working with nodegrapher

The project extensively uses the nodegrapher library for image processing. Key features include:

- Full graph extraction with `processImageToGraph`
- Road network generation with `saveRoad`
- Configurable processing parameters
- Support for various image formats

Example usage in the Express demo:

```typescript
// Process full graph data
const graphData = await GraphService.processFullGraph(imagePath, maxContain);

// Process road network data
const roadGraph = await GraphService.processRoadGraph(imagePath, maxContain);
```

## Development Container

This project includes a development container configuration for VS Code, which provides a consistent development environment across different machines. The container is configured with:

- Node.js 22 runtime environment
- Essential build tools and libraries for canvas support
- Pre-configured VS Code extensions:
  - ESLint for code linting
  - Prettier for code formatting

### Prerequisites

To use the development container:
1. Install [Docker](https://www.docker.com/get-started) on your machine
2. Install the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension in VS Code

### Getting Started with Dev Container

1. Clone the repository
2. Open the project in VS Code
3. When prompted, click "Reopen in Container" or run the "Dev Containers: Reopen in Container" command from the Command Palette
4. The container will build and install all dependencies automatically

The development container ensures all developers work with the same environment and dependencies, including system-level libraries required for packages like `canvas`.

## License

This project is licensed under the BSD 2-Clause License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
