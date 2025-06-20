import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from "vitest";
import { act } from "@testing-library/react";
import {
  render,
  fireEvent,
  queryByText,
} from "@testing-library/react";

import Dropdown from "@/src/components/dropdown/Dropdown";

/* ──────────────────────────────────────────────
   1 ▸  Stubs for SVG icon and CSS module
────────────────────────────────────────────── */
vi.mock("@/src/assets/icons/rightArrowIcon.svg", () => ({
  default: () => <span data-testid="arrow" />,
}));

// Any import ending in .module.css returns a proxy that gives back the key name

/* ──────────────────────────────────────────────
   2 ▸  Helper to mount a minimal dropdown
────────────────────────────────────────────── */
function renderDropdown(onSelect = vi.fn()) {
  return render(
    <Dropdown>
      <Dropdown.Button id="btn">Menu</Dropdown.Button>
      <Dropdown.List id="list">
        <Dropdown.Item
          idx={0}
          selectedIdx={null}
          id="opt-1"
          onClick={onSelect}
        >
          {`Option 1`}
        </Dropdown.Item>
        <Dropdown.Item
          idx={1}
          selectedIdx={null}
          id="opt-2"
          onClick={onSelect}
        >
          {`Option 2`}
        </Dropdown.Item>
      </Dropdown.List>
    </Dropdown>,
  );
}

/* =================================================================== */
describe("<Dropdown /> stack", () => {
  beforeEach(() => vi.clearAllMocks());

  /* ---- initial state: list hidden ------------------------------- */
  it("starts closed (list not rendered)", () => {
    const { container } = renderDropdown();
    expect(container.querySelector("#list")).toBeEmptyDOMElement();
  });

  /* ---- button toggles context ---------------------------------- */
  it("toggles list visibility on button click", () => {
    const { getByText, container } = renderDropdown();

    const button = getByText("Menu");

    /* open */
    act(() => fireEvent.click(button));
    expect(container.querySelector("#list")).toHaveTextContent("Option 1");

    /* close */
    act(() => fireEvent.click(button));
    expect(container.querySelector("#list")).toBeEmptyDOMElement();
  });

  /* ---- item click fires callback ------------------------------- */
  it("invokes onClick on item and keeps list open", () => {
    const handleSelect = vi.fn();
    const { getByText } = renderDropdown(handleSelect);

    /* open menu */
    fireEvent.click(getByText("Menu"));
    const item = getByText("Option 2");

    fireEvent.click(item);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    // list still visible after click (component itself doesn’t close menu)
    expect(queryByText(document.body, "Option 2")).toBeInTheDocument();
  });

  /* ---- item highlights when selectedIdx matches ---------------- */
  it("applies selected styling when idx === selectedIdx", () => {
    // mount with selectedIdx=0 for first item
    const { container } = render(
      <Dropdown>
        <Dropdown.Button>Menu</Dropdown.Button>
        <Dropdown.List id="list">
          <Dropdown.Item
            idx={0}
            selectedIdx={0}
            onClick={vi.fn()}
          >
            First
          </Dropdown.Item>
        </Dropdown.List>
      </Dropdown>,
    );

    fireEvent.click(container.querySelector("button")!);

    const firstDiv = container.querySelector("#list > div")!;
    expect(firstDiv.className).toMatch(/selected/);
  });
});
