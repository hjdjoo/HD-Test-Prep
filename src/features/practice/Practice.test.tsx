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
import { MemoryRouter } from "react-router-dom";

import Practice from "@/src/pages/practice/practice";
import { userStore } from "@/src/stores/userStore";
import { resetStores } from "@/utils/testing/resetStores";
import {
  renderWithQueryClient,
  client,
} from "@/utils/testing/renderWithContext";
import {
  sampleUser,
  sampleQuestion,
  mockCategories,
  mockProblemTypes,
  mockTagsData
} from "@/src/_const/testConst";

/* Mock Child UI */
vi.mock(
  "@/src/features/practice/containers/PracticeContainer.Random",
  () => ({
    default: () => <div data-testid="random">RANDOM-PRACTICE</div>,
  }),
);

vi.mock(
  "@/src/features/practice/components/Practice.LinkInstructorModal",
  () => ({
    default: ({ setOpen }: any) => (
      <div data-testid="link-modal">
        MODAL
        <button onClick={() => setOpen(false)}>close</button>
      </div>
    ),
  }),
);

vi.mock("components/loading/Loading", () => ({
  default: () => <div data-testid="loading">LOAD</div>,
}));

vi.mock("@/src/ErrorPage", () => ({
  default: () => <div data-testid="error">ERR</div>,
}));

/* Query Stubs */
import fetchQuestions from "@/src/queries/GET/getQuestions";
import fetchCategories from "@/src/queries/GET/getCategories";
import fetchProblemTypes from "@/src/queries/GET/getProblemTypes";
import fetchTags from "@/src/queries/GET/getTags";
vi.mock("@/src/queries/GET/getQuestions", () => ({
  default: vi.fn(),
}));
vi.mock("@/src/queries/GET/getCategories", () => ({
  default: vi.fn(),
}));
vi.mock("@/src/queries/GET/getProblemTypes", () => ({
  default: vi.fn(),
}));
vi.mock("@/src/queries/GET/getTags", () => ({
  default: vi.fn(),
}));

/* Render Helper */
const renderPage = () =>
  renderWithQueryClient(
    <MemoryRouter>
      <Practice />
    </MemoryRouter>,
  );

/* Tests */
describe("<Practice /> page", () => {
  beforeEach(() => {
    act(() => resetStores());

    (fetchCategories as any).mockResolvedValue(mockCategories);
    (fetchQuestions as any).mockResolvedValue([sampleQuestion]);
    (fetchProblemTypes as any).mockResolvedValue(mockProblemTypes);
    (fetchTags as any).mockResolvedValue(mockTagsData[0]);

    client.clear();
  });

  afterEach(() => vi.clearAllMocks());

  it("shows <Loading> while any query is pending", () => {
    // Keep one query unresolved
    (fetchQuestions as any).mockReturnValueOnce(
      new Promise(() => { }), // never resolves
    );

    const { getByTestId } = renderPage();
    expect(getByTestId("loading")).toBeInTheDocument();
  });

  it("renders <ErrorPage> if any query rejects", async () => {

    (fetchCategories as any).mockRejectedValueOnce(
      new Error("boom"),
    );

    const { findByTestId } = renderPage();
    expect(await findByTestId("error")).toBeInTheDocument();
  });

  it("renders RandomPractice without modal for linked user", async () => {
    act(() =>
      userStore.setState({
        user: { ...sampleUser, instructor_id: 3 },
      }),
    );

    const { findByTestId, queryByTestId } = renderPage();

    await waitFor(() => expect(client.isFetching()).toBe(0));

    expect(await findByTestId("random")).toBeInTheDocument();
    expect(queryByTestId("link-modal")).toBeNull();
  });

  it("opens LinkInstructorModal for unlinked user and hides on close", async () => {
    act(() =>
      userStore.setState({
        user: { ...sampleUser, instructor_id: null },
      }),
    );

    const { findByTestId, getByText, queryByTestId } = renderPage();

    await waitFor(() => expect(client.isFetching()).toBe(0));

    expect(await findByTestId("link-modal")).toBeInTheDocument();

    fireEvent.click(getByText("close"));
    expect(queryByTestId("link-modal")).toBeNull();
  });
});
