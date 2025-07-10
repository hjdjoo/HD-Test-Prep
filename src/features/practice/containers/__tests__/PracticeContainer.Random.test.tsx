import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from "vitest";
import {
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";
import RandomPractice from "@/src/features/practice/containers/PracticeContainer.Random";

import { questionStore } from "@/src/stores/questionStore";
import { usePracticeSessionStore } from "@/src/stores/practiceSessionStore";
import { userStore } from "@/src/stores/userStore";

import { sampleQuestion, sampleUser } from "@/src/_const/testConst";
import { resetStores } from "@/utils/testing/resetStores";
import { renderWithQueryClient } from "@/utils/testing/renderWithContext";

// Child UI mocks
vi.mock(
  "@/src/features/practice/containers/PracticeContainer.Question",
  () => ({
    default: ({ question }: { question: any }) => (
      <div data-testid="question-container">{question.question}</div>
    ),
  }),
);

vi.mock("@/src/features/practice/components/Practice.filter", () => ({
  default: () => <div data-testid="filter-panel">FILTER PANEL</div>,
}));

vi.mock(
  "@/src/features/practice/components/Practice.continue",
  () => ({
    default: () => (
      <div data-testid="continue-modal">CONTINUE MODAL</div>
    ),
  }),
);

vi.mock(
  "@/src/features/practice/containers/PracticeContainer.Report",
  () => ({
    default: () => (
      <div data-testid="session-report">SESSION REPORT</div>
    ),
  }),
);

vi.mock("@/src/ErrorPage", () => ({
  default: () => <div data-testid="error-page">ERROR PAGE</div>,
}));

// server-side query mocks;
import getPracticeSession from "@/src/queries/GET/getPracticeSession";
import startPracticeSession from "@/src/queries/POST/startPracticeSession";
import getResponsesBySession from "@/src/queries/GET/getResponsesBySession";

vi.mock("@/src/queries/GET/getPracticeSession", () => ({
  default: vi.fn(),
}));
vi.mock("@/src/queries/POST/startPracticeSession", () => ({
  default: vi.fn(),
}));
vi.mock("@/src/queries/GET/getResponsesBySession", () => ({
  default: vi.fn().mockResolvedValue([]),
}));
vi.mock("@/src/queries/PATCH/endPracticeSession", () => ({
  default: vi.fn(),
}));


const queryClient = new QueryClient();
const renderWithClient = renderWithQueryClient;

describe("<PracticeContainer.Random>", () => {
  beforeEach(() => {
    resetStores();

    vi.spyOn(Math, "random").mockReturnValue(0);

    questionStore.setState({ filteredQuestions: [sampleQuestion] });
    (getResponsesBySession as any).mockResolvedValue([]);

    userStore.setState({ user: sampleUser });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    queryClient.clear();
  });

  it("starts a new session and renders a question on Start click", async () => {
    (getPracticeSession as any).mockResolvedValueOnce(null);
    (startPracticeSession as any).mockResolvedValueOnce({ id: 123 });


    const { findByRole, findByTestId } = renderWithClient(<RandomPractice />);

    const startBtn = await findByRole("button", { name: /start/i });
    fireEvent.click(startBtn);

    expect(
      await findByTestId("question-container"),
    ).toHaveTextContent("42");

    expect(usePracticeSessionStore.getState().sessionId).toBe(123);
    expect(startPracticeSession).toHaveBeenCalledWith(sampleUser.id, "random");
  });

  /* ----------------------------------------------------------- */
  it("detects previous session and shows Continue modal", async () => {
    (getPracticeSession as any).mockResolvedValueOnce({ id: 555 });

    const { findByTestId } = renderWithClient(<RandomPractice />);

    await waitFor(async () => {
      expect(
        await findByTestId("continue-modal"),
      ).toBeInTheDocument();
      expect(usePracticeSessionStore.getState().sessionId).toBe(555);
      expect(startPracticeSession).not.toHaveBeenCalled();
    })

  });

  /* ----------------------------------------------------------- */
  it("toggles filter panel with Customize Session button", async () => {
    (getPracticeSession as any).mockResolvedValueOnce(null);
    (startPracticeSession as any).mockResolvedValueOnce({ id: 999 });

    const { findByRole, getByTestId, getByRole, queryByTestId } = renderWithClient(<RandomPractice />);

    const toggle = await findByRole("button", {
      name: /customize session/i,
    });

    fireEvent.click(toggle);

    expect(getByTestId("filter-panel")).toBeVisible();

    /* close panel */
    fireEvent.click(
      getByRole("button", { name: /close filters/i }),
    );
    await waitFor(() =>
      expect(
        queryByTestId("filter-panel"),
      ).not.toBeInTheDocument(),
    );
  });
});
