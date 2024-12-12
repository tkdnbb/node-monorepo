// @flow
import * as React from 'react';
import { type Node } from 'react';
import { RouterProvider } from '@tanstack/react-router';
import router from './router';

export default function App(): Node {
  return <RouterProvider router={router} />;
}
