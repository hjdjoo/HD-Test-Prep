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
  waitFor,
  fireEvent,
} from "@testing-library/react";
import * as routerModule from "react-router-dom";
import { renderWithQueryClient, client } from "@/utils/testing/renderWithContext";

import { sampleUser, mockClientFeedback, mockSessionResponses, mockQuestionImages } from "@/src/_const/testConst";
import { resetStores } from "@/utils/testing/resetStores";

/* component under test */
import PdfContainer from "@/src/features/pdf/containers/PdfContainer";

/* ────────────────────────────────────────────────
   1 ▸  Stub heavy/irrelevant children & hooks
───────────────────────────────────────────────── */
vi.mock("react-router-dom", async () => {
  const routerModule = await vi.importActual("react-router-dom");
  return {
    ...routerModule,
    useNavigate: vi.fn().mockReturnValue(vi.fn())
  }
})

vi.mock("@react-pdf/renderer", () => ({
  PDFViewer: ({ children }: any) => <div data-testid="viewer">{children}</div>,
}));

vi.mock(
  "@/src/features/pdf/components/Pdf.Report",
  () => ({ default: () => <div data-testid="report">PDF-REPORT</div> }),
);

vi.mock(
  "components/loading/Loading",
  () => ({ default: () => <div data-testid="loading">LOAD</div> }),
);

vi.mock(
  "containers/modal/ModalContainer",
  () => ({ default: ({ children }: any) => <div data-testid="modal">{children}</div> }),
);

vi.mock(
  "../../sessionReport/components/SessionReport.SendPdfModal",
  () => ({ default: () => <div data-testid="send-modal">SEND-MODAL</div> }),
);

vi.mock("@/src/hooks/useQuestionsAnswered", () => ({
  default: () => 1,
}));

vi.mock("@/src/hooks/useQuestionsCorrect", () => ({
  default: () => 1,
}));

vi.mock("@/src/ErrorPage", () => ({
  default: () => <div data-testid="error">ERR</div>,
}));

/* ────────────────────────────────────────────────
   2 ▸  Mock network helpers
───────────────────────────────────────────────── */
vi.mock("@/src/queries/GET/getResponsesBySession", () => {
  return ({
    default: vi.fn().mockResolvedValue(mockSessionResponses),
  })
});
vi.mock("@/src/queries/GET/getFeedbackById", () => ({
  default: vi.fn().mockResolvedValue(mockClientFeedback),
}));
vi.mock("@/src/queries/GET/getTagsById", () => ({
  default: vi.fn().mockResolvedValue({ "301": "Algebra" }),
}));
/* Supabase signed URLs */
import { supabase } from "@/vitest.setup";
//@ts-expect-error
supabase.storage.from.mockImplementation(() => ({
  createSignedUrls: vi.fn().mockResolvedValue(({
    data: mockQuestionImages.map((i) => ({ signedUrl: i.imageUrl })),
    error: null
  })),
}));

/* ────────────────────────────────────────────────
   3 ▸  User-store helper
───────────────────────────────────────────────── */
import { userStore } from "@/src/stores/userStore";


/* ────────────────────────────────────────────────
   4 ▸  Query-client & render helper
───────────────────────────────────────────────── */
const { MemoryRouter, useNavigate } = routerModule;
const renderUI = (sessionId: string) =>
  renderWithQueryClient(
    <MemoryRouter>
      <PdfContainer sessionId={sessionId} />
    </MemoryRouter>
  )

/* ────────────────────────────────────────────────
   5 ▸  Tests
───────────────────────────────────────────────── */
describe("<PdfContainer>", () => {
  beforeEach(() => {
    act(() => resetStores());
    client.clear();
  });

  afterEach(() => vi.clearAllMocks());

  it("renders <ErrorPage> when no user present", () => {
    const { getByTestId } = renderUI("123");
    expect(getByTestId("error")).toBeInTheDocument();
  });

  it("shows Loading then PdfReport on success", async () => {
    act(() => userStore.setState({ user: sampleUser }));

    const {
      getByTestId,
      queryByTestId,
      getByRole,
    } = renderUI("123");

    /* spinner first */
    expect(getByTestId("loading")).toBeInTheDocument();

    /* wait until all React-Query fetches are done */
    await waitFor(() => expect(client.isFetching()).toBe(0));

    /* spinner disappears & PDF viewer mounts */
    await waitFor(() => {
      expect(queryByTestId("loading")).not.toBeInTheDocument();
      expect(getByTestId("viewer")).toBeInTheDocument();
      expect(getByTestId("report")).toBeInTheDocument();
    })

    /* Send Report button opens modal */
    fireEvent.click(getByRole("button", { name: /send report/i }));
    expect(getByTestId("modal")).toBeInTheDocument();
    expect(getByTestId("send-modal")).toBeInTheDocument();
  });

  it("Back to Practice button triggers navigation", async () => {
    /* replace navigate with spy */
    const navigate = useNavigate();
    act(() => userStore.setState({ user: sampleUser }));
    const { getByRole } = renderUI("456");

    await waitFor(() => expect(client.isFetching()).toBe(0));

    fireEvent.click(getByRole("button", { name: /back to practice/i }));
    expect(navigate).toHaveBeenCalledWith("/practice");
  });

  it("renders <ErrorPage> if query throws", async () => {
    act(() => userStore.setState({ user: sampleUser }));

    /* next call will reject */
    const getResponses = await import("@/src/queries/GET/getResponsesBySession");
    (getResponses.default as any).mockRejectedValueOnce(
      new Error("boom"),
    );

    const { findByTestId } = renderUI("999");
    expect(await findByTestId("error")).toBeInTheDocument();
  });
});
