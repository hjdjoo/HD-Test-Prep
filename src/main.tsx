import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import PracticePage from './routes/practice.tsx';
import ErrorPage from './ErrorPage.tsx';
import {
  createBrowserRouter, 
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={ <ErrorPage/> }>
      <Route 
        path="/" 
        element={<App/>} />
      <Route
        path="/practice"
        element={ <PracticePage/> } />
    </Route>
  )
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
