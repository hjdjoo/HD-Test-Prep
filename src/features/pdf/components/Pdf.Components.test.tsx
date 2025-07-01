import {
  describe,
  it,
  expect,
  vi,
  afterEach,
} from "vitest";
import { render } from "@testing-library/react";

import PdfSummary from "@/src/features/pdf/components/Pdf.Summary";
import PdfItem from "@/src/features/pdf/components/Pdf.Item";
import PdfReport from "@/src/features/pdf/components/Pdf.Report";

import {
  mockSessionResponseData,
  mockQuestionImages,
  mockFeedbackData,
  mockTagsData,
  mockQuestions,
  sampleUser,
} from "@/src/_const/testConst";

/* ──────────────────────────────────────────────
   1 ▸  Stub @react-pdf/renderer primitives
────────────────────────────────────────────── */
vi.mock("@react-pdf/renderer", async () => {

  const original = await vi.importActual("@react-pdf/renderer")

  const Primitive = (tag: keyof JSX.IntrinsicElements) => {
    const RenderTag = tag;
    return ({ children, ...rest }: any) => {
      return (
        <RenderTag {...rest}>{children}</RenderTag>
      )
    };
  }


  return {
    ...original,
    Text: Primitive("span"),
    View: Primitive("div"),
    Link: ({ src, children }: any) => <a href={src}>{children}</a>,
    Image: ({ src }: any) => <img src={src} alt="img" />,
    Page: Primitive("section"),
    Document: ({ children }: any) => (
      <div data-testid="doc">{children}</div>
    ),
    PDFViewer: Primitive("div"),
  };
});

/* ──────────────────────────────────────────────
   2 ▸  Stub styles module to empty object
────────────────────────────────────────────── */

/* ──────────────────────────────────────────────
   3 ▸  Local helpers
────────────────────────────────────────────── */
const question = mockQuestions[0];
const response = mockSessionResponseData[0];
const feedback = mockFeedbackData[0].data;
const tagsMap = mockTagsData[0].data;

/* =================================================================== */
describe("PDF components", () => {
  afterEach(() => vi.clearAllMocks());

  /* -------- Pdf.Summary ------------------------------------------ */
  it("<Pdf.Summary> displays counts", () => {
    const { getByText } = render(
      <PdfSummary questionsAnswered={10} questionsCorrect={7} />,
    );

    expect(getByText(/questions answered/i).nextSibling!.textContent).toBe("10");
    expect(getByText(/questions correct/i).nextSibling!.textContent).toBe("7");
  });

  /* -------- Pdf.Item --------------------------------------------- */
  it("<Pdf.Item> renders core info, tags, rating & time", () => {
    const { getByText, getByRole } = render(
      <PdfItem
        question={question}
        studentResponse={response}
        feedbackForm={feedback}
        tagsData={tagsMap}
      />,
    );

    // core
    expect(getByText(/question number/i)).toBeInTheDocument();
    expect(getByText(String(question.question))).toBeInTheDocument();
    expect(getByText(/student response/i).nextSibling!.textContent).toBe(
      response.response,
    );
    expect(getByText(/answer:/i).nextSibling!.textContent).toBe(question.answer);

    // tags + difficulty
    expect(getByText("Linear Equations")).toBeInTheDocument();
    expect(getByText("Hard")).toBeInTheDocument();

    // time taken
    expect(getByText(/time taken/i).nextSibling!.textContent).toMatch(/s$/);

    // link to image
    expect(getByRole("link", { name: /link to image/i })).toHaveAttribute(
      "href",
      feedback!.imageUrl!,
    );
  });

  /* -------- Pdf.Report  (happy path) ------------------------------ */
  it("<Pdf.Report> happy path renders student name, summary, details", () => {
    const { getByText, getAllByText, getByTestId } = render(
      <PdfReport
        studentResponses={mockSessionResponseData}
        questionImageData={mockQuestionImages}
        feedbackData={mockFeedbackData}
        tagsData={mockTagsData}
        questionsAnswered={mockQuestions}
        questionsCorrect={2}
        user={sampleUser}
      />,
    );

    // wrapper
    expect(getByTestId("doc")).toBeInTheDocument();

    // student info
    expect(
      getByText(new RegExp(`Student Name: ${sampleUser.name}`)),
    ).toBeInTheDocument();

    // summary counts
    expect(getByText(/questions answered/i).nextSibling!.textContent).toBe("3");
    expect(getByText(/questions correct/i).nextSibling!.textContent).toBe("2");

    // details: one section per response
    console.log(getAllByText(/question 1|question 2|question 3/i))
    expect(getAllByText(/question 1|question 2|question 3/i)).toHaveLength(3);
  });

  /* -------- Pdf.Report  (nothing to render) ----------------------- */
  it("<Pdf.Report> shows fallback when no answered questions", () => {
    const { getByText } = render(
      <PdfReport
        studentResponses={[]}
        questionImageData={[]}
        feedbackData={[]}
        tagsData={[]}
        questionsAnswered={[]}
        questionsCorrect={0}
        user={sampleUser}
      />,
    );

    expect(getByText(/nothing to render/i)).toBeInTheDocument();
  });
});
