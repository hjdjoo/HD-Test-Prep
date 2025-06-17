import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";


export const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  }
});
/**
 * Testing utility for rendering  with query client.
 * @argument ui: React Element
 * @returns RenderResult from react testing library with wrapped element.
 */
export const renderWithQueryClient = (ui: React.ReactElement) =>
  render(
    <QueryClientProvider client={client} >
      {ui}
    </QueryClientProvider>,
  );