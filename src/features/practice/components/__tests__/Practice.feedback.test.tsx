import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from "vitest";
import { act, fireEvent, render } from "@testing-library/react";
import React, { useState } from "react";
// import { Canvas } from "canvas";

import FeedbackForm from "@/src/features/practice/components/Practice.feedback";
import type { FeedbackForm as FeedbackType } from "@/src/_types/client-types";
import { questionStore } from "@/src/stores/questionStore";
import { useTagStore } from "@/src/stores/tagStore";
import { apiFetch } from "@/utils/apiFetch";

import { StudentResponse } from "@/src/_types/client-types";
import { mockQuestions, mockFeedbackForms, mockStudentResponses } from "@/src/_const/testConst";

/* Global mocks & stubs */
// icons
vi.mock("@/src/assets/icons/deleteIcon.svg", () => ({
  default: () => <span
    data-testid="delete-icon"
  />
}));
vi.mock("@/src/assets/icons/uploadIcon.svg", () => ({
  default: () => <span
    data-testid="upload-icon"
  />
}));
vi.mock("@/src/assets/icons/trashIcon.svg", () => ({
  default: () => <span
    data-testid="trash-icon"
  />
}));
// components
vi.mock("containers/modal/ModalContainer", () => ({
  default: ({ children }: any) => <div>{children}</div>
}));
vi.mock("components/autocomplete/Autocomplete", () => ({
  default: ({ setActiveTags }:
    { setActiveTags: (t: string[]) => void }) => {
    React.useEffect(() => setActiveTags(["Linear Equations"]), [setActiveTags]);
    return <div data-testid="autocomplete" />;
  },
}));
// utilities
vi.mock("@/src/config", () => ({ SERVER_URL: "https://api.test" }));
vi.mock("@/utils/apiFetch", () => ({ apiFetch: vi.fn() }));

/* Global stubs for FileReader and Image */
class FileReaderMockClass {
  result: string | null = null;
  onloadend: (() => any) | null = null;
  onload: ((ev: ProgressEvent<FileReader>) => any) | null = null;
  readAsDataURL = vi.fn()
    .mockImplementation((file: File) => {
      const result = (file instanceof File && file instanceof Blob) ?
        "data:image/png;base64,AAA" :
        "data:image/png;base64,COMPRESSED";
      this.result = result;
      const evt = {
        target: {
          result
        }
      }
      if (this.onload) {
        this.onload(evt as any)
      }
      if (this.onloadend) {
        this.onloadend()
      }
    })
}

vi.stubGlobal("FileReader", FileReaderMockClass);

/* shared fixtures */
const question = mockQuestions[0];
const studentResponse = mockStudentResponses[0];
const mockFeedbackForm = mockFeedbackForms[0];

/* seed tagStore so tag → id mapping exists */
useTagStore.getState().setTags({ "Linear Equations": 101 });

/* test wrapper with local state mirrors parent */
function Wrapper() {
  const [response, setResponse] = useState<StudentResponse | undefined>(studentResponse);
  const [feedbackForm, setFeedbackForm] = useState<FeedbackType | undefined>(mockFeedbackForm);
  const [_submitStatus, setSubmitStatus] = useState<"waiting" | "submitting" | "submitted">("waiting");

  return (
    response && feedbackForm &&
    <FeedbackForm
      question={question}
      studentResponse={response}
      setStudentResponse={setResponse}
      feedbackForm={feedbackForm}
      setFeedbackForm={setFeedbackForm}
      setSubmitStatus={setSubmitStatus}
    />
  );
}

/* ==== Basic inputs: difficulty select, guess, and comment ==== */
describe("<Practice.feedback>: basic inputs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    act(() =>
      questionStore.setState({
        questions: [question],
        setQuestions: vi.fn(),
      }),
    );
  });

  afterEach(() => vi.resetModules());

  /* ---- Difficulty radios -------------------------------------- */
  it("updates difficultyRating when radio selected", () => {
    const { getByLabelText } = render(<Wrapper />);
    const hardRadio = getByLabelText("Hard") as HTMLInputElement;

    expect(hardRadio).toHaveAttribute("name", "difficultyRating");

    fireEvent.click(hardRadio);

    expect(hardRadio.checked).toBe(true);
  });

  /* ---- Comment textarea --------------------------------------- */
  it("allows student to type a comment", () => {
    const { getByRole } = render(<Wrapper />);
    const textarea = getByRole("textbox") as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "Need help here" } });

    expect(textarea.value).toBe("Need help here");
  });



  /* ---- Submit calls apiFetch with compiled body --------------- */
  it("submits feedback form and calls apiFetch", async () => {
    (apiFetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 555, updatedQuestion: question }),
    });

    const { getByRole } = render(<Wrapper />);
    const submitBtn = getByRole("button", { name: /submit/i });

    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(apiFetch).toHaveBeenCalledTimes(1);
    // @ts-expect-error
    const [url, options] = apiFetch.mock.calls[0];
    expect(url).toBe("https://api.test/db/feedback/new");
    expect(options.method).toBe("POST");
    const body = JSON.parse(options.body);
    // ensure tag 101 (Linear Equations) got pushed
    expect(body.feedbackForm.tags).toContain(101);
  });
});

/* === Image upload preview === */
describe("Image upload preview subcomponent", () => {
  // stub global Image;
  const ImageMockClass = class {
    height = 0;
    width = 0;
    onload(): void {
      // console.log(this.src);
    }
    set src(_val: string) {
      this.onload();
    }
  }
  vi.stubGlobal("Image", ImageMockClass);

  beforeEach(() => {
    vi.clearAllMocks();
    // vi.stubGlobal("FileReader", FileReaderMockClass);

    act(() =>
      questionStore.setState({
        questions: [question],
        setQuestions: vi.fn(),
      }),
    );

  });
  afterEach(() => vi.resetModules());

  it("does nothing if no file is uploaded", async () => {
    const component = render(<Wrapper />);

    const { getByLabelText } = component

    const fileInput = getByLabelText(/upload/i) as HTMLInputElement;

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [] } });
    });

    expect(component).toMatchSnapshot();
  })

  it("shows preview after image upload and allows removing upload", async () => {
    const { findByTestId, getByLabelText, findByAltText } = render(<Wrapper />);

    const fileInput = getByLabelText(/upload/i) as HTMLInputElement;

    const file = new File(["dummy"], "work.png", { type: "image/png" });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    expect(await findByAltText(/upload preview/i)).toBeInTheDocument();

    const deleteButton = await findByTestId("trash-icon");
    expect(deleteButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(deleteButton)
    });

    expect(deleteButton).not.toBeInTheDocument();

  });

  it("compresses large images", async () => {
    // (global as any).Image.height = 4000;
    // (global as any).Image.width = 4000;
    // ImageMockClass.height = 4000;
    // spies for methods called;
    const drawSpy = vi.fn();
    const toBlobSpy = vi.fn((cb: BlobCallback) => {
      cb(new Blob(["X"], { type: "image/png" }))
    })

    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      drawImage: drawSpy
    } as any)
    vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(toBlobSpy);


    // bind createElement to document -- ensure that createElement is called normally for all other tags. When the test is run, "document" is undefined, so we give the function the proper "this" context.
    // const createElementOrig = document.createElement.bind(document);

    // vi.spyOn(document, "createElement").mockImplementation((tag) => {
    //   if (tag === "canvas") {
    //     return new CanvasMock() as unknown as HTMLCanvasElement;
    //   }
    //   return createElementOrig(tag);
    // });


    const { findByAltText, getByLabelText } = render(<Wrapper />);

    const fileInput = getByLabelText(/upload/i) as HTMLInputElement;

    const file = new File([new Uint8Array(1024 * 1024 * 4)], "large.png", { type: "image/png" });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } })
    })

    expect(drawSpy).toHaveBeenCalled();
    // expect(toBlobSpy).toHaveBeenCalled();
    // expect(toDataUrlSpy).toHaveBeenCalled();

    const preview = await findByAltText(/upload preview/i);
    expect(preview).toHaveAttribute("src", "data:image/png;base64,COMPRESSED");


  })

})
