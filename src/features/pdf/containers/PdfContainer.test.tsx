import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from "vitest";
import { act } from "@testing-library/react";
import {
  render,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes, useParams } from "react-router-dom";

import PdfReport from "@/src/features/pdf/PdfReport";
import { userStore } from "@/src/stores/userStore";

/* ───────────────────────────────────────────────────────────
   1 ▸  Stub child components & hooks
─────────────────────────────────────────────────────────── */
vi.mock("components/loading/Loading", () => ({
  default: () => <div data-testid="loading">LOADING…</div>,
}));

vi.mock(
  "@/src/features/pdf/containers/PdfContainer",
  () => ({
    // lazy() resolves to this immediately
    default: ({ sessionId }: { sessionId: string }) => (
      <div data-testid="pdf">PDF {sessionId}</div>
    ),
  }),
);

vi.mock("@/src/ErrorPage", () => ({
  default: () => <div data-testid="error">ERR</div>,
}));

/* helper to stub useParams */

const mockUseParams = (idObj: Record<string, string | undefined>) => {
  vi.mocked(require("react-router-dom")).useParams = () => idObj;
};

/* util to render PdfReport inside a router path */
const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/pdf/:id?" element={<PdfReport />} />
      </Routes>
    </MemoryRouter>,
  );

/* sample user object */
const user = {
  id: 9,
  uid: "uid-9",
  role: "student" as const,
  name: "Bob",
  email: "b@example.com",
  instructor_id: 3,
};

/* ─────────────────────────────────────────────────────────── */
describe("<PdfReport>", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(() => {
    // clean user store between tests
    act(() => userStore.setState({ user: null }));
  });

  it("renders <ErrorPage> when no user", () => {
    mockUseParams({ id: "123" });

    const { getByTestId } = renderAt("/pdf/123");
    expect(getByTestId("error")).toBeInTheDocument();
  });

  it("renders <ErrorPage> when sessionId param missing", () => {
    act(() => userStore.setState({ user }));
    mockUseParams({}); // id undefined

    const { getByTestId } = renderAt("/pdf");
    expect(getByTestId("error")).toBeInTheDocument();
  });

  it("shows Loading then PdfContainer when authorized & param present", async () => {
    act(() => userStore.setState({ user }));
    mockUseParams({ id: "456" });

    const { findByTestId, queryByTestId } = renderAt("/pdf/456");

    /* Suspense fallback visible first */
    expect(await findByTestId("loading")).toBeInTheDocument();

    /* wait until React has resolved lazy() */
    await waitFor(() =>
      expect(queryByTestId("loading")).not.toBeInTheDocument(),
    );

    /* PdfContainer now rendered with correct id */
    expect(await findByTestId("pdf")).toHaveTextContent("PDF 456");
  });
});
