// @flow
import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
} from '@tanstack/react-router';
import Home from './components/Home';
import './styles/About.css';

// $FlowFixMe: QueryClient constructor accepts config options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// Create an About component
const About = (): React$Node => (
  <div className="about-container">
    <h1>About Tokyo Exhibition Center Navigation</h1>
    <p>This application helps visitors navigate through the Tokyo Exhibition Center using:</p>
    <ul>
      <li>Interactive 3D floor plans</li>
      <li>Real-time navigation</li>
      <li>Multi-floor pathfinding</li>
      <li>Optimized routing algorithms</li>
    </ul>
    <div className="tech-stack">
      <h2>Technology Stack</h2>
      <ul>
        <li>React for UI</li>
        <li>Three.js for 3D rendering</li>
        <li>Express.js backend</li>
        <li>MongoDB for data storage</li>
      </ul>
    </div>
  </div>
);

// Create a root layout component
const RootLayout = (): React$Node => (
  <QueryClientProvider client={queryClient}>
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
        <Link 
          to="/"
          style={{ marginRight: '1rem', textDecoration: 'none', color: '#3498db' }}
        >
          Home
        </Link>
        <Link 
          to="/about"
          style={{ textDecoration: 'none', color: '#3498db' }}
        >
          About
        </Link>
      </nav>
      <Outlet />
    </div>
  </QueryClientProvider>
);

// Define routes
const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: About,
});

// Create the route tree
const routeTree = rootRoute.addChildren([indexRoute, aboutRoute]);

// Create and configure the router
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

export default router; 