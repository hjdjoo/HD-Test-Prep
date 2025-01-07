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

import Home from './pages/home.tsx';
// import PracticeContainer from "containers/practice/PracticeContainer";
import Practice from './pages/practice.tsx';
import Report from './pages/report.tsx';
import PdfReport from './pages/pdfReport.tsx';
import Account from './pages/account.tsx';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorPage />}>
      <Route
        path="/"
        element={<App />} >
        <Route path="/" element={<Home />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/account" element={<Account />} />
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
