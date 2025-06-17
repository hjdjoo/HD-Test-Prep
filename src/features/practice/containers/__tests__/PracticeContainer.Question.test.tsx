import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from "vitest";
import {
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { useEffect } from "react";

import QuestionContainer from "@/src/features/practice/containers/PracticeContainer.Question";
import { usePracticeSessionStore } from "@/src/stores/practiceSessionStore";
import { userStore } from "@/src/stores/userStore";
import { supabase } from "@/vitest.setup";

import {
  sampleQuestion,
  sampleUser,
} from "@/src/_const/testConst";
import { resetStores } from "@/utils/testing/resetStores";
import {
  client,
  renderWithQueryClient,
} from "@/utils/testing/renderWithContext";

/* ──────────────────────────────────────────────────────────
   Child-component stubs
─────────────────────────────────────────────────────────── */

vi.mock("components/loading/Loading.Spinner", () => ({
  default: () => <div data-testid="loading-spinner" />
}))

vi.mock(
  "@/src/features/practice/components/Practice.timer",
  () => ({ default: () => <div /> }),
);

vi.mock(
  "@/src/features/practice/components/Practice.questionImage.js",
  () => ({
    /**
     * Mimics real component: on mount -> fetch → setImageLoaded(true)
     */
    default: ({
      imageQuestionUrl,
      imageLoaded,
      setImageLoaded,
    }: any) => {
      useEffect(() => {
        setImageLoaded(true);
      }, [setImageLoaded]);
      return (
        <div data-testid="img">
          {imageLoaded && imageQuestionUrl}
        </div>
      );
    },
  }),
);

vi.mock(
  "@/src/features/practice/components/Practice.answers.js",
  () => ({
    default: ({
      answerChoices,
      setResponse,
    }: {
      answerChoices: string[];
      setResponse: (s: string) => void;
    }) => (
      <div>
        {answerChoices.map((c) => (
          <button
            key={c}
            data-testid={`choice-${c}`}
            onClick={() => setResponse(c)}
          >
            {c}
          </button>
        ))}
      </div>
    ),
  }),
);

vi.mock(
  "@/src/features/practice/components/Practice.feedback",
  () => ({
    default: ({
      setSubmitStatus,
    }: {
      setSubmitStatus: (s: string) => void;
    }) => (
      <div>
        <button data-testid="submit-feedback"
          onClick={() => setSubmitStatus("submitted")}
        >
          SUBMIT
        </button>
      </div>
    )
  }),
);

vi.mock("components/alert/Alert", () => ({
  default: ({ alert }: any) => (
    <div role="alert">{alert?.message}</div>
  ),
}));

vi.mock("@/src/ErrorPage", () => ({
  default: () => <div data-testid="error-page">ERR</div>,
}));

/* ──────────────────────────────────────────────────────────
   Network helpers
─────────────────────────────────────────────────────────── */
import { apiFetch } from "@/utils/apiFetch";
vi.mock("@/utils/apiFetch", () => ({
  apiFetch: vi.fn(),
}));

/* ──────────────────────────────────────────────────────────
   Supabase storage stub — good path by default
─────────────────────────────────────────────────────────── */
const createSignedUrl = vi
  .fn()
  .mockResolvedValue({
    data: { signedUrl: "https://img.local/q.png" },
    error: null,
  });
// @ts-expect-error
supabase.storage.from.mockImplementation(() => ({ createSignedUrl }));

/* shorthand for render helper */
const renderWithClient = renderWithQueryClient;

describe("<PracticeContainer.Question>", () => {

  const getNextQuestion = vi.fn();

  beforeEach(() => {
    resetStores();
    userStore.setState({ user: sampleUser });
    vi.clearAllMocks();

    act(() => {
      usePracticeSessionStore.setState({
        sessionId: 987,
        sessionQuestions: [],
        sessionResponses: [],
      })
    })

  });

  afterEach(() => client.clear());

  it("happy path: select answer → feedback → save & next", async () => {
    (apiFetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 999 }),
    });

    const { getByTestId, getByRole } = renderWithClient(
      <QuestionContainer
        question={sampleQuestion}
        getNextQuestion={getNextQuestion}
      />,
    );

    await waitFor(() => {
      expect(client.isFetching()).toBe(0);
    })

    await waitFor(() => {
      fireEvent.click(getByTestId("choice-A"));
      fireEvent.click(getByRole("button", { name: /submit/i }));
    })

    await waitFor(() => {
      expect(getByTestId("submit-feedback")).toBeInTheDocument();
    })

    await waitFor(() => {
      fireEvent.click(getByTestId("submit-feedback"));
      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringMatching(/student_responses\/new$/),
        expect.objectContaining({ method: "POST" }),
      )
    });
    expect(
      usePracticeSessionStore.getState().sessionResponses,
    ).toContain(999);
    expect(getNextQuestion).toHaveBeenCalled();
  });

  /* ----------------------------------------------------------- */
  it("shows warning when Submit pressed without answer", async () => {
    const { getByRole, findByRole } = renderWithClient(
      <QuestionContainer
        question={sampleQuestion}
        getNextQuestion={getNextQuestion}
      />,
    );

    await waitFor(() => {
      expect(client.isFetching()).toBe(0);
    })

    fireEvent.click(getByRole("button", { name: /submit/i }));

    expect(await findByRole("alert")).toHaveTextContent(
      /please select an answer/i,
    );
    expect(apiFetch).not.toHaveBeenCalled();
  });

  /* ----------------------------------------------------------- */
  it("renders <ErrorPage> when image URL fetch fails", async () => {
    createSignedUrl.mockResolvedValueOnce({
      data: null,
      error: new Error("boom"),
    });

    const { findByTestId } = renderWithClient(
      <QuestionContainer
        question={sampleQuestion}
        getNextQuestion={getNextQuestion}
      />,
    );
    await waitFor(() => {
      expect(client.isFetching()).toBe(0);
    })

    expect(await findByTestId("error-page")).toBeInTheDocument();
  });
});
