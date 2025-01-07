import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ErrorPage from './ErrorPage.tsx';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";

import HomePage from './pages/home.tsx';
import PracticePage from './pages/practice.tsx';
import AccountPage from './pages/account.tsx';
import PdfReport from './features/pdf/PdfReport.tsx';
import Report from './pages/report.tsx';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorPage />}>
      <Route
        path="/"
        element={<App />} >
        <Route path="/" element={<HomePage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/report/:id" element={<Report />} />
        <Route path="/report/pdf/:id" element={<PdfReport />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
