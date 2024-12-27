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

import Home from './routes/home.tsx';
// import PracticeContainer from "containers/practice/PracticeContainer";
import Practice from './routes/practice.tsx';
import AccountContainer from "containers/account/AccountContainer";
import Report from './routes/report.tsx';
import PdfReport from './routes/pdfReport.tsx';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorPage />}>
      <Route
        path="/"
        element={<App />} >
        <Route path="/" element={<Home />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/account" element={<AccountContainer />} />
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
