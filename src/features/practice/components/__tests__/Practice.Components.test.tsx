import {
  describe, it, expect, vi, beforeEach, afterEach
} from "vitest";
import { useState } from "react";
import { act, fireEvent, screen, render, renderHook, waitFor } from "@testing-library/react";

import Answers from "@/src/features/practice/components/Practice.answers";
import Timer from "@/src/features/practice/components/Practice.timer";
import QuestionImage from "@/src/features/practice/components/Practice.questionImage";
import ContinuePracticeModal from "@/src/features/practice/components/Practice.continue";
import LinkInstructorModal from "@/src/features/practice/components/Practice.LinkInstructorModal";

import { questionStore } from "@/src/stores/questionStore";
import { usePracticeSessionStore } from "@/src/stores/practiceSessionStore";
import { useCategoryStore } from "@/src/stores/categoryStore";
import { userStore } from "@/src/stores/userStore";

import { renderWithQueryClient } from "@/utils/testing/renderWithContext";
import { mockQuestions, mockCategories, mockProblemTypes, sampleUser }
  from "@/src/_const/testConst";

/*   global stubs & helpers  */
vi.mock("containers/modal/ModalContainer", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));
vi.mock("@/src/assets/icons/playIcon.svg", () => ({ default: () => <span /> }));
vi.mock("@/src/assets/icons/pauseIcon.svg", () => ({ default: () => <span /> }));

const { result: { current } } =
  renderHook(() => {
    return useCategoryStore();
  })

const { setCategories, setProblemTypes } = current;

beforeEach(() => {
  vi.useFakeTimers();
  questionStore.setState({ questions: mockQuestions });
  userStore.setState({ user: sampleUser, bootstrapped: true });
  setCategories(mockCategories);
  setProblemTypes(mockProblemTypes);
});

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe("<Practice.answers>", () => {

  it("calls setResponse with clicked value and toggles selected class", () => {
    const { result: { current } } = renderHook(() => {
      const [response, setResponse] = useState<string>()
      return { response, setResponse }
    })

    const { response, setResponse } = current;

    const { getByLabelText } = render(<Answers
      answerChoices={["A", "B", "C"]}
      question={mockQuestions[0]}
      response={response}
      setResponse={setResponse}
    />);

    const choiceC = getByLabelText("C"); // label doubles as control
    act(() => {
      fireEvent.click(choiceC);
    });

    // expect(setResponse).toHaveBeenCalledWith("C");
    // console.log(choiceC.className);
    // repeat click → same handler, but check we now have the selected class
    waitFor(() => {
      expect(choiceC.className).toMatch(/radioButtonSelected/);
    })
  });
});

/* =======================================================================
   Timer – (start → tick) - then stop on submitStatus change
   ======================================================================= */
describe("<Practice.timer>", () => {
  function Wrapper({ submitStatus = "waiting" }: { submitStatus?: any }) {
    const [time, setTime] = useState(0);
    const [timerOn, setTimerOn] = useState(false);
    return (
      <Timer
        start={true}
        timerOn={timerOn}
        setTimerOn={setTimerOn}
        submitStatus={submitStatus}
        time={time}
        setTime={setTime}
      />
    );
  }

  it("starts ticking from 00:00 and stops when submitStatus ≠ waiting", () => {
    const { rerender } = render(<Wrapper />);

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText("00:03")).toBeInTheDocument();

    rerender(<Wrapper submitStatus="submitted" />);
    vi.advanceTimersByTime(2000);
    expect(screen.getByText("00:03")).toBeInTheDocument();
  });
});


describe("<Practice.questionImage>", () => {
  it("renders <img> after preload succeeds", () => {
    const { result: { current } } = renderHook(() => {
      const [imageLoaded, setImageLoaded] = useState<boolean>(false);
      return { imageLoaded, setImageLoaded }
    })

    vi.spyOn(current, "setImageLoaded");

    const { imageLoaded, setImageLoaded } = current;

    const { getByAltText } = render(<QuestionImage
      imageUrl="https://cdn/img.png"
      imageLoaded={imageLoaded}
      setImageLoaded={setImageLoaded}
    />);

    waitFor(() => {
      expect(setImageLoaded).toHaveBeenCalledWith(true);
      expect(getByAltText(/question image/i)).toBeInTheDocument();
    })

  });

  it("shows spinner and logs when preload errors", () => {
    vi.spyOn(console, "error").mockImplementation(() => { });

    const setLoaded = vi.fn();
    const { queryByAltText } = render(<QuestionImage
      imageUrl="bad/url"
      imageLoaded={false}
      setImageLoaded={setLoaded}
    />);

    waitFor(() => {
      expect(queryByAltText(/question image/i)).not.toBeInTheDocument();
      expect(setLoaded).toHaveBeenCalledWith(false);
    })

  });
});

import endPracticeSession from "@/src/queries/PATCH/endPracticeSession";
import startPracticeSession from "@/src/queries/POST/startPracticeSession";
vi.mock("@/src/queries/PATCH/endPracticeSession");
vi.mock("@/src/queries/POST/startPracticeSession");

describe("<Practice.continue>", () => {

  it("hides modal when user continues prior session", () => {
    const setIsPrev = vi.fn();
    render(<ContinuePracticeModal
      user={sampleUser}
      sessionId={123}
      setIsPrevSession={setIsPrev}
      practiceType="random"
    />);
    fireEvent.click(screen.getByRole("button", { name: /continue previous/i }));
    expect(setIsPrev).toHaveBeenCalledWith(false);
    expect(endPracticeSession).not.toHaveBeenCalled();
  });

  it("ends old session and boots a new one when Start New is clicked", async () => {

    const { result: { current: isPrevCurrent } } = renderHook(() => {
      const [isPrev, setIsPrev] = useState<boolean>(false);
      return { isPrev, setIsPrev };
    })

    const { setIsPrev } = isPrevCurrent;

    const { result: { current: practiceSessionStoreCurrent } } = renderHook(() => {
      return usePracticeSessionStore();
    })

    vi.spyOn(practiceSessionStoreCurrent, "setSessionId")

    const { setSessionId } = practiceSessionStoreCurrent;

    render(<ContinuePracticeModal
      user={sampleUser}
      sessionId={123}
      setIsPrevSession={setIsPrev}
      practiceType="structured"
    />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /start new/i }));
    });

    waitFor(() => {
      expect(endPracticeSession).toHaveBeenCalledWith(123, "inactive");
      expect(startPracticeSession).toHaveBeenCalledWith(sampleUser.id, "structured");
      expect(setSessionId).toHaveBeenCalledWith(999);
      expect(setIsPrev).toHaveBeenCalledWith(false);
    })
  });
});


import getStudents from "@/src/queries/GET/getStudents";
import getInstructors from "@/src/queries/GET/getInstructors";
vi.mock("@/src/queries/GET/getStudents");
vi.mock("@/src/queries/GET/getInstructors");
describe("<Practice.linkInstructor>", () => {

  vi.mock("@/src/pages/admin/components/Admin.EditStudent",
    () => ({ default: () => <div data-testid="edit-student" /> }));

  (getStudents as any).mockResolvedValue([sampleUser]);
  (getInstructors as any).mockResolvedValue([{
    createdAt: "1970-01-01T00:00:00Z",
    email: "test@tutor.com",
    id: 42,
    name: "Test Tutor"
  }]);

  it("shows <Loading> until both queries resolve, then renders EditStudent", async () => {

    const { result: { current } } = renderHook(() => {
      const [open, setOpen] = useState<boolean>(false);
      return { open, setOpen };
    })

    const { setOpen } = current;

    const { findByTestId, queryByTestId } = renderWithQueryClient(
      <LinkInstructorModal setOpen={setOpen} />
    );

    // initially loading component present
    waitFor(async () => {
      expect(queryByTestId("edit-student")).not.toBeInTheDocument();

      const editor = await findByTestId("edit-student");
      expect(editor).toBeInTheDocument();
    })

  });
});
