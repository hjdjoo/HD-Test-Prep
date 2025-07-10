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
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

import SessionReportContainer from "@/src/features/sessionReport/containers/SessionReportContainer";
import { resetStores } from "@/utils/testing/resetStores";
import { mockSessionResponseData } from "@/src/_const/testConst";

vi.mock("@/src/features/sessionReport/components/SessionReport.Report", () => ({
  default: () => <div data-testid="report-doc">REPORT-DOC</div>,
}));

vi.mock(
  "@/src/features/sessionReport/components/SessionReport.SendPdfModal",
  () => ({
    default: ({ sessionId }: { sessionId: string }) => (
      <div data-testid="send-modal">SEND {sessionId}</div>
    ),
  }),
);

vi.mock("containers/modal/ModalContainer", () => ({
  default: ({ children }: any) => <div data-testid="modal">{children}</div>,
}));

vi.mock("components/alert/Alert", () => ({
  default: ({ alert }: any) => (
    <div role="alert">{alert?.message || "ALERT"}</div>
  ),
}));

vi.mock("components/loading/Loading", () => ({
  default: () => <div data-testid="loading">LOAD</div>,
}));

vi.mock("@/src/ErrorPage", () => ({
  default: () => <div data-testid="error">ERR</div>,
}));

vi.mock("@/src/queries/GET/getResponsesBySession", () => ({
  default: vi.fn(),
}));
import getResponsesBySession from "@/src/queries/GET/getResponsesBySession";

const qc = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderUI = (sessionId = "9001") =>
  render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <SessionReportContainer sessionId={sessionId} />
      </MemoryRouter>
    </QueryClientProvider>,
  );

/* =================================================================== */
describe("<SessionReportContainer>", () => {
  beforeEach(() => {
    act(() => resetStores());
    qc.clear();
  });
  afterEach(() => vi.clearAllMocks());

  /* ---- Loading state -------------------------------------------- */
  it("shows <Loading> while query is pending", () => {
    (getResponsesBySession as any).mockReturnValue(
      new Promise(() => { }), // never resolves
    );

    const { getByTestId } = renderUI();
    expect(getByTestId("loading")).toBeInTheDocument();
  });

  /* ---- Error state ---------------------------------------------- */
  it("renders <ErrorPage> on query error", async () => {
    (getResponsesBySession as any).mockRejectedValueOnce(
      new Error("boom"),
    );

    const { findByTestId } = renderUI();
    expect(await findByTestId("error")).toBeInTheDocument();
  });

  it("renders Report and action buttons on success", async () => {
    (getResponsesBySession as any).mockResolvedValueOnce(
      mockSessionResponseData,
    );

    const { findByTestId, getByRole } = renderUI("123");

    await waitFor(() => expect(qc.isFetching()).toBe(0));

    expect(await findByTestId("report-doc")).toBeInTheDocument();
    expect(
      getByRole("link", { name: /view pdf report/i }),
    ).toHaveAttribute("href", "/report/pdf/123");
  });

  /* ---- Send button: empty responses -> warning ------------------ */
  it("shows warning alert when Send clicked but no data", async () => {
    (getResponsesBySession as any).mockResolvedValueOnce([]);

    const { getByRole, findByRole } = renderUI("222");

    await waitFor(() => expect(qc.isFetching()).toBe(0));

    fireEvent.click(getByRole("button", { name: /send report/i }));
    expect(await findByRole("alert")).toHaveTextContent(/nothing to send/i);
  });

  /* ---- Send button: data exists -> opens modal ------------------ */
  it("opens SendPdfModal when data present", async () => {
    (getResponsesBySession as any).mockResolvedValueOnce(
      mockSessionResponseData,
    );

    const { getByRole, findByTestId } = renderUI("333");

    await waitFor(() => expect(qc.isFetching()).toBe(0));

    fireEvent.click(getByRole("button", { name: /send report/i }));
    expect(await findByTestId("modal")).toBeInTheDocument();
    expect(await findByTestId("send-modal")).toHaveTextContent("SEND 333");
  });
});
