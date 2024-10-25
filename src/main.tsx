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

import HomeContainer from "./containers/home/HomeContainer";
import PracticeContainer from "containers/practice/PracticeContainer";
import AccountContainer from "containers/account/AccountContainer";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorPage />}>
      <Route
        path="/"
        element={<App />} >
        <Route path="/" element={<HomeContainer />} />
        <Route path="/practice" element={<PracticeContainer />} />
        <Route path="/account" element={<AccountContainer />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
