import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";

export const client = new QueryClient();

export const renderWithQueryClient = (ui: React.ReactElement) =>
  render(
    <QueryClientProvider client={client} > {ui} </QueryClientProvider>,
  );