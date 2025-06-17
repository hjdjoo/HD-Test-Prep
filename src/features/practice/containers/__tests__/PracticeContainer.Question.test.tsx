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
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import QuestionContainer from "@/src/features/practice/containers/PracticeContainer.Question";
import { usePracticeSessionStore } from "@/src/stores/practiceSessionStore";
import { userStore } from "@/src/stores/userStore";
import { supabase } from "@/vitest.setup";

import { sampleQuestion, sampleUser } from "@/src/_const/testConst";
import { resetStores } from "@/utils/testing/resetStores";
import { client, renderWithQueryClient } from "@/utils/testing/renderWithContext";

/**
 * Mocking child UI components
 */
vi.mock(
  "@/src/features/practice/components/Practice.timer",
  () => ({ default: () => <div /> }),
);
vi.mock(
  "@/src/features/practice/components/Practice.questionImage.js",
  () => ({
    default: ({ imageLoaded, setImageLoaded }: any) => (
      <button
        data-testid="img"
        onClick={() => setImageLoaded(true)}
      >
        {imageLoaded && `IMG`}
      </button>
    ),
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
      <button
        data-testid="submit-feedback"
        onClick={() => setSubmitStatus("submitted")}
      >
        SUBMIT
      </button>
    ),
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

import { apiFetch } from "@/utils/apiFetch";
vi.mock("@/utils/apiFetch", () => ({
  apiFetch: vi.fn(),
}));

const renderWithClient = renderWithQueryClient;

/* ==================================================================== */
describe("<PracticeContainer.Question>", () => {
  const getNextQuestion = vi.fn();

  beforeEach(() => {
    resetStores();
    // put user directly into userStore without importing the store (isolate)
    userStore.setState({ user: sampleUser });
    vi.clearAllMocks();
  });

  afterEach(() => client.clear());

  /* ----------------------------------------------------------- */
  it("flows happy-path: select answer → feedback → save & next", async () => {
    (apiFetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 999 }),
    });

    const { findByTestId, getByTestId, getByRole } = renderWithClient(
      <QuestionContainer
        question={sampleQuestion}
        getNextQuestion={getNextQuestion}
      />,
    );

    /* 1 ⸺ click the QuestionImage stub to mark loaded → answers appear */
    userEvent.click(await findByTestId("img"));

    /* 2 ⸺ choose answer */
    fireEvent.click(getByTestId("choice-A"));

    /* 3 ⸺ first Submit opens feedback modal */
    fireEvent.click(
      getByRole("button", { name: /submit/i }),
    );
    expect(getByTestId("submit-feedback")).toBeInTheDocument();

    /* 4 ⸺ feedback modal triggers final submission */
    fireEvent.click(getByTestId("submit-feedback"));

    /* 5 ⸺ apiFetch called & store updated */
    await waitFor(() =>
      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringMatching(/student_responses\/new$/),
        expect.objectContaining({ method: "POST" }),
      ),
    );
    expect(
      usePracticeSessionStore.getState().sessionResponses,
    ).toContain(999);
    expect(getNextQuestion).toHaveBeenCalled();
  });

  /* ----------------------------------------------------------- */
  it("shows warning when Submit pressed without answer", async () => {
    renderWithClient(
      <QuestionContainer
        question={sampleQuestion}
        getNextQuestion={getNextQuestion}
      />,
    );

    userEvent.click(await screen.findByTestId("img")); // load

    fireEvent.click(
      screen.getByRole("button", { name: /submit/i }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /please select an answer/i,
    );
    expect(apiFetch).not.toHaveBeenCalled();
  });

  /* ----------------------------------------------------------- */
  it("renders <ErrorPage> when image URL fetch fails", async () => {
    // re-mock createSignedUrl to throw

    // @ts-expect-error
    supabase.storage.from.mockImplementation(() => {
      (_id: string) => {

        const createSignedUrl = vi
          .fn()
          .mockResolvedValue(
            { data: { signedUrl: "https://img.local/q.png" } })
          .mockRejectedValue(
            new Error("boom"),);

        return {
          createSignedUrl
        };

      }
    })

    // // @ts-expect-error
    // supabase.storage.from("1").createSignedUrl.mockRejectedValue(
    //   new Error("boom"),
    // );

    renderWithClient(
      <QuestionContainer
        question={sampleQuestion}
        getNextQuestion={getNextQuestion}
      />,
    );

    expect(
      await screen.findByTestId("error-page"),
    ).toBeInTheDocument();
  });
});
