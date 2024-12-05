# Express Demo Backend User Guide

This guide provides comprehensive documentation for the Express.js backend service that powers the Tokyo International Exhibition Center Navigation system.

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Development](#development)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [TypeScript Support](#typescript-support)

## Overview

The Express Demo backend is a Node.js/Express.js server that provides:
- Graph processing capabilities for map data
- REST API endpoints for graph operations
- Static file serving
- TypeScript support

## Installation

1. Clone the repository
2. Navigate to the expressdemo directory
3. Install dependencies:
```bash
npm install
```

## Development

Start the development server with hot reload:
```bash
npm run dev
```

Other available scripts:
- `npm run build` - Build TypeScript files
- `npm start` - Start the production server
- `npm test` - Run tests (currently not implemented)

## API Reference

### Graph Processing Endpoints

#### POST /api/process-map
Upload and process a full map image.
- Method: POST
- Content-Type: multipart/form-data
- Body: 
  - image: File (image to process)

#### POST /api/process-road
Upload and process a road map image.
- Method: POST
- Content-Type: multipart/form-data
- Body:
  - image: File (image to process)

#### GET /api/graph-data
Retrieve processed graph data.
- Method: GET
- Response: JSON containing graph data

#### GET /api/road-graph-data
Retrieve processed road graph data.
- Method: GET
- Response: JSON containing road graph data

## Project Structure

```
expressdemo/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Express middleware
│   ├── routes/         # API route definitions
│   └── server.ts       # Main application entry
├── public/            # Static files
├── dist/             # Compiled JavaScript
└── temp/             # Temporary file storage
```

### Key Components
- `server.ts`: Main application entry point
- `graphRoutes.ts`: Graph-related API endpoint definitions
- `graphController.ts`: Graph processing logic
- `upload.ts`: File upload middleware

## Configuration

The application uses a configuration system located in `src/config/`. Key configuration options include:
- Port number
- Public directory path
- Temporary file storage location

## TypeScript Support

The project is written in TypeScript and includes:
- Full type definitions
- TSConfig configuration
- Type checking during development

To work with TypeScript:
1. Write code using TypeScript in the `src/` directory
2. Use provided type definitions
3. Run `npm run build` to compile to JavaScript

## Dependencies

Key dependencies include:
- Express.js for the web server
- Multer for file uploads
- Nodegrapher for graph processing
- TypeScript for type safety

## Best Practices

1. Always validate input data
2. Handle file uploads securely
3. Use TypeScript types for better code reliability
4. Follow the established project structure
5. Add appropriate error handling

## Error Handling

The API includes error handling for:
- Invalid file uploads
- Processing errors
- Missing data
- Server errors

## Deployment

To deploy the application:

1. Build the TypeScript files:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

The server will be available at `http://localhost:<configured_port>`.

## Troubleshooting

Common issues and solutions:

1. **File Upload Issues**
   - Check file size limits
   - Verify file type restrictions
   - Ensure temp directory exists and is writable

2. **Build Issues**
   - Run `npm run build` to check for TypeScript errors
   - Verify all dependencies are installed
   - Check TypeScript configuration

3. **Runtime Errors**
   - Check server logs
   - Verify configuration settings
   - Ensure all required directories exist

For additional support, check the error logs or file an issue in the repository.
