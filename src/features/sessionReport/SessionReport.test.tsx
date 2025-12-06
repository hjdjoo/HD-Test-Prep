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
  screen,
} from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import SessionReport from "@/src/features/sessionReport/SessionReport";
import { userStore } from "@/src/stores/userStore";
import { resetStores } from "@/utils/testing/resetStores";
import { sampleUser } from "@/src/_const/testConst";

/* ──────────────────────────────────────────────
   1 ▸  Stub heavy children
────────────────────────────────────────────── */
vi.mock(
  "@/src/features/sessionReport/containers/SessionReportContainer",
  () => ({
    default: ({ sessionId }: { sessionId: string }) => (
      <div data-testid="report" data-id={sessionId}>
        REPORT {sessionId}
      </div>
    ),
  }),
);

vi.mock("@/src/ErrorPage", () => ({
  default: () => <div data-testid="error-page">ERR</div>,
}));

/* ──────────────────────────────────────────────
   2 ▸  Helper to mount component along a route
────────────────────────────────────────────── */
function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/report/:id?" element={<SessionReport />} />
      </Routes>
    </MemoryRouter>,
  );
}

/* =================================================================== */
describe("<SessionReport>", () => {
  beforeEach(() => {
    act(() => resetStores());
  });
  afterEach(() => vi.clearAllMocks());

  /* ---- No user => ErrorPage ------------------------------------- */
  it("shows <ErrorPage> when userStore.user is null", () => {
    userStore.setState({ user: null });

    renderAt("/report/123");
    expect(screen.getByTestId("error-page")).toBeInTheDocument();
  });

  /* ---- User + id => ReportContainer rendered -------------------- */
  it("renders ReportContainer when user exists and id param present", () => {
    userStore.setState({ user: sampleUser });

    renderAt("/report/9001");
    const report = screen.getByTestId("report");

    expect(report).toBeInTheDocument();
    expect(report).toHaveAttribute("data-id", "9001");
  });

  /* ---- User + *no* id => nothing rendered ----------------------- */
  it("renders nothing when id param missing", () => {
    userStore.setState({ user: sampleUser });

    const { container } = renderAt("/report");
    // neither error nor report present
    expect(container).toBeEmptyDOMElement();
  });
});
