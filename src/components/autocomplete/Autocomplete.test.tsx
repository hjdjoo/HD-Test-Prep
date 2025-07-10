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
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import Autocomplete from "@/src/components/autocomplete/Autocomplete";
import {
  renderWithQueryClient,
  client,
} from "@/utils/testing/renderWithContext";
import { resetStores } from "@/utils/testing/resetStores";
import { mockTagStoreState } from "@/src/_const/testConst";
import { useTagStore } from "@/src/stores/tagStore";


vi.mock("@/utils/debounce", () => ({
  default: (fn: any) => fn,
}));


vi.mock("@/src/assets/icons/deleteIcon.svg", () => ({
  default: () => <span data-testid="del" />,
}));
vi.mock("@/src/assets/icons/addIcon.svg", () => ({
  default: () => <span data-testid="add" />,
}));

function Wrapper() {
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const feedbackForm = { tags: activeTags } as any;

  return (
    <Autocomplete
      feedbackForm={feedbackForm}
      setFeedbackForm={vi.fn()}
      activeTags={activeTags}
      setActiveTags={setActiveTags}
    />
  );
}

const renderUI = () => renderWithQueryClient(<Wrapper />);

describe("<Autocomplete>", () => {
  beforeEach(() => {
    act(() => {
      resetStores();
      useTagStore.getState().setTags(mockTagStoreState);
    });
    client.clear();
  });

  afterEach(() => vi.clearAllMocks());

  it("filters suggestions as user types", async () => {
    const { getByPlaceholderText, findByText, queryByText } = renderUI();

    const input = getByPlaceholderText(/press enter/i);
    await userEvent.type(input, "Line"); // match Linear Equations

    expect(await findByText("Linear Equations")).toBeInTheDocument();
    expect(queryByText("Quadratics")).toBeNull();
  });

  it("navigates suggestions with arrows and selects with Enter", async () => {
    const { getByPlaceholderText, findByTestId, queryByTestId } = renderUI();
    const input = getByPlaceholderText(/press enter/i);

    await userEvent.type(input, "Lin");
    await userEvent.keyboard("{arrowdown}{enter}");

    await waitFor(async () => {
      expect((await findByTestId("del")).closest('[id^="tag-chip-"]')).toHaveTextContent(
        "Linear Equations"
      );

      expect(queryByTestId("add")?.closest('[id^="autocomplete-suggestions"]')).toHaveAttribute("hidden");
    })

  });

  it("adds free-text tag when Enter pressed without suggestion", async () => {
    const { getByPlaceholderText, findByText } = renderUI();
    const input = getByPlaceholderText(/press enter/i);

    await userEvent.type(input, "CustomTag{enter}");
    expect(await findByText("CustomTag")).toBeInTheDocument();
  });

  it("adds tag via click and clears input", async () => {
    const { getByPlaceholderText, findByText } = renderUI();
    const input = getByPlaceholderText(/press enter/i);

    await userEvent.type(input, "Quad");
    fireEvent.click(await findByText("Quadratics"));

    expect(await findByText("Quadratics")).toBeInTheDocument();
    expect((input as HTMLInputElement).value).toBe("");
  });

  it("removes tag when delete icon clicked", async () => {
    const { getByPlaceholderText, findByText, getByTestId } = renderUI();
    const input = getByPlaceholderText(/press enter/i);

    await userEvent.type(input, "Word{enter}");

    const chip = await findByText("Word Problems");

    const autoCompleteBoxWrapper = chip.closest('[id^="autocomplete-wrapper"]')

    fireEvent.click(getByTestId("del"));

    await waitFor(() => {

      expect(autoCompleteBoxWrapper?.firstChild).not.toHaveTextContent("Word Problems");
    }
    );
  });
});
