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
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ReportContainer from "@/src/features/practice/containers/PracticeContainer.Report";
import { usePracticeSessionStore } from "@/src/stores/practiceSessionStore";
import { userStore } from "@/src/stores/userStore";

import {
  renderWithQueryClient,
  client,
} from "@/utils/testing/renderWithContext";
import {
  sampleUser,
  mockSessionResponseData,
  mockQuestions
} from "@/src/_const/testConst";
import { resetStores } from "@/utils/testing/resetStores";

/* ──────────────────────────────────────────
   1 ▸  Stub child components & utilities
────────────────────────────────────────── */

vi.mock(
  "@/src/features/sessionReport/summary/containers/SummaryContainer",
  () => ({
    default: () => <div data-testid="summary">SUMMARY</div>,
  }),
);

vi.mock(
  "../../../sessionReport/detail/containers/DetailContainer",
  () => ({
    default: () => <div data-testid="details">DETAILS</div>,
  }),
);

vi.mock(
  "containers/modal/ModalContainer",
  () => ({ default: ({ children }: any) => <div data-testid="modal">{children}</div> }),
);

vi.mock(
  "../../../sessionReport/components/SessionReport.SendPdfModal",
  () => ({
    default: ({ sessionId }: { sessionId: string }) => (
      <div data-testid="send-modal">SEND {sessionId}</div>
    ),
  }),
);

vi.mock("components/loading/Loading.Spinner", () => ({
  default: () => <div data-testid="spinner">SPIN</div>,
}));

vi.mock("@/src/ErrorPage", () => ({
  default: () => <div data-testid="error">ERR</div>,
}));

/* ---- hooks returning derived data ------------------------ */
import useQuestionsAnswered from "@/src/hooks/useQuestionsAnswered";
import useQuestionsCorrect from "@/src/hooks/useQuestionsCorrect";
vi.mock("@/src/hooks/useQuestionsAnswered", () => ({ default: vi.fn() }));
vi.mock("@/src/hooks/useQuestionsCorrect", () => ({ default: vi.fn() }));

/* shorthand helpers */
const renderUI = (responses = mockSessionResponseData) =>
  renderWithQueryClient(
    <MemoryRouter>
      <ReportContainer studentResponses={responses} />
    </MemoryRouter>,
  );

const setSessionId = (id: number | null) =>
  act(() =>
    usePracticeSessionStore.setState({
      sessionId: id,
      sessionResponses: [],
      sessionQuestions: [],
    }),
  );

/*  Tests */
describe("<PracticeContainer.Report>", () => {
  beforeEach(() => {
    act(() => resetStores());        // clears other stores
    userStore.setState({ user: sampleUser });
    client.clear();

    (useQuestionsAnswered as any).mockReturnValue(mockQuestions);
    (useQuestionsCorrect as any).mockReturnValue(1);
  });

  afterEach(() => vi.clearAllMocks());

  /* ---- guard: no sessionId -> ErrorPage ------------------ */
  it("renders <ErrorPage> when sessionId missing", () => {
    setSessionId(null);
    const { getByTestId } = renderUI();
    expect(getByTestId("error")).toBeInTheDocument();
  });

  /* ---- summary shown, details toggles -------------------- */
  it("toggles DetailsContainer with button click", async () => {

    setSessionId(987);


    const {
      getByTestId,
      queryByTestId,
      getByRole,
    } = renderUI();

    // summary visible immediately
    expect(getByTestId("summary")).toBeInTheDocument();
    expect(queryByTestId("details")).toBeNull();

    // click to show details
    fireEvent.click(
      getByRole("button", { name: /click to view details/i }),
    );

    expect(await waitFor(() => getByTestId("details"))).toBeInTheDocument();

    // click again hides
    fireEvent.click(
      getByRole("button", { name: /click to hide details/i }),
    );
    expect(queryByTestId("details")).toBeNull();
  });

  /* ---- End Session & Send Report ------------------------- */
  it("opens SendPdfModal when answers exist", async () => {
    setSessionId(555);

    const { getByRole, findByTestId } = renderUI();

    fireEvent.click(
      getByRole("button", { name: /end session & send report/i }),
    );

    expect(await findByTestId("modal")).toBeInTheDocument();
    expect(await findByTestId("send-modal")).toHaveTextContent("SEND 555");
  });

  it("does NOT open modal when no answers", () => {
    setSessionId(444);
    // return empty answered list
    (useQuestionsAnswered as any).mockReturnValue([]);

    const { getByRole, queryByTestId } = renderUI([]);

    fireEvent.click(
      getByRole("button", { name: /end session & send report/i }),
    );
    expect(queryByTestId("modal")).toBeNull();
  });

  /* ---- Link to /report/:id always present ---------------- */
  it("renders View Session Report link with correct href", () => {
    setSessionId(222);
    const { getByRole } = renderUI();
    expect(getByRole("link", { name: /view session report/i })).toHaveAttribute(
      "href",
      "/report/222",
    );
  });
});
