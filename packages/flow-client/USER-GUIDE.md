# Flow Client User Guide

Flow Client is a React-based web application that provides graph visualization and path-finding capabilities. This guide will help you get started with using and developing the application.

## Table of Contents
- [Installation](#installation)
- [Development](#development)
- [Features](#features)
- [Project Structure](#project-structure)
- [TypeScript and Flow Support](#typescript-and-flow-support)

## Installation

1. Clone the repository
2. Navigate to the flow-client directory
3. Install dependencies:
```bash
npm install
```

## Development

To start the development server:
```bash
npm run dev
```

Other available scripts:
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run flow` - Run Flow type checker
- `npm run flow:check` - Check Flow types
- `npm run flow:status` - Check Flow status

## Features

### Graph Visualization
The application provides a canvas-based graph visualization system that can display both full and road graph data.

### File Upload
- Supports file uploads for graph data
- Configurable maximum containment parameter
- Handles both full and road graph data types

### Path Finding
Includes path-finding functionality with:
- Start and end point selection
- Interactive visualization of paths
- Real-time updates

## Project Structure

```
flow-client/
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom React hooks
│   ├── types/         # Flow type definitions
│   └── App.jsx        # Main application component
├── public/            # Static assets
├── dist/             # Build output
└── flow-typed/       # Flow type definitions for dependencies
```

### Key Components
- `MapCanvas`: Handles graph visualization
- `PathFindingForm`: User interface for path finding operations
- `useGraphData`: Hook for managing graph data state
- `useFileUpload`: Hook for handling file uploads
- `usePathFinding`: Hook for path finding operations

## TypeScript and Flow Support

The project uses Flow for static type checking. Key type-related files:
- `.flowconfig` - Flow configuration
- `flow-typed/` - Third-party library type definitions

To add Flow types to new files:
1. Add `// @flow` at the top of your file
2. Run `npm run flow:check` to verify types

## Dependencies

Key dependencies include:
- React 18.3
- @tanstack/react-query for data management
- Radix UI components for UI elements
- Tailwind CSS for styling

## Best Practices

1. Always run Flow type checking before committing changes
2. Follow the existing component structure for new features
3. Use the provided hooks for data management
4. Write tests for new functionality
5. Follow the established ESLint configuration

## Troubleshooting

If you encounter issues:
1. Check Flow types with `npm run flow:check`
2. Verify all dependencies are installed
3. Clear your build directory and rebuild
4. Check the console for error messages

For more detailed information, refer to the source code documentation and comments.
