import {
  describe, it, expect, beforeEach, afterEach,
} from "vitest";
import {
  act, render, renderHook, waitFor,
} from "@testing-library/react";

import {
  useCategoryStore,
  Category,
  ProblemType,
} from "@/src/stores/categoryStore";
import { useTagStore } from "@/src/stores/tagStore";
import { useProfilesStore } from "@/src/stores/profilesStore";

import {
  mockCategories,
  mockProblemTypes,
  sampleUser,
} from "@/src/_const/testConst";

/* Component Stubs */
function CategoryCount() {
  const len = useCategoryStore((s) => s.categories.length);
  return <span data-testid="cat-count">{len}</span>;
}
function ProblemTypeCount() {
  const len = useCategoryStore((s) => s.problemTypes.length);
  return <span data-testid="ptype-count">{len}</span>;
}
function TagKeys() {
  const keys = Object.keys(useTagStore((s) => s.tags)).join(",");
  return <span data-testid="tag-keys">{keys}</span>;
}
function StudentCount() {
  const len = useProfilesStore((s) => s.students.length);
  return <span data-testid="stu-count">{len}</span>;
}
function InstructorCount() {
  const len = useProfilesStore((s) => s.instructors.length);
  return <span data-testid="inst-count">{len}</span>;
}

/* Helpers */
const resetStores = () => {
  useCategoryStore.setState({ categories: [], problemTypes: [] });
  useTagStore.setState({ tags: {} });
  useProfilesStore.setState({ students: [], instructors: [] });
};

describe("Zustand Stores", () => {
  beforeEach(() => resetStores());
  afterEach(() => resetStores());

  it("updates categories & problemTypes and re-renders subscribers", async () => {
    const { getByTestId } = render(
      <>
        <CategoryCount />
        <ProblemTypeCount />
      </>,
    );

    expect(getByTestId("cat-count").textContent).toBe("0");
    expect(getByTestId("ptype-count").textContent).toBe("0");

    const {
      result: { current: categoryStore },
    } = renderHook(() => useCategoryStore());

    act(() => {
      categoryStore.setCategories(mockCategories as Category[]);
      categoryStore.setProblemTypes(mockProblemTypes as ProblemType[]);
    });

    await waitFor(() => {
      expect(getByTestId("cat-count").textContent)
        .toBe(String(mockCategories.length));
      expect(getByTestId("ptype-count").textContent)
        .toBe(String(mockProblemTypes.length));
    });
  });

  it("stores tag -> id map and notifies listeners", async () => {
    const { getByTestId } = render(<TagKeys />);

    expect(getByTestId("tag-keys").textContent).toBe("");

    const {
      result: { current: tagStore },
    } = renderHook(() => useTagStore());

    const tags = { Algebra: 201, Geometry: 202 };  // any mapping is fine
    act(() => tagStore.setTags(tags));

    await waitFor(() =>
      expect(getByTestId("tag-keys").textContent).toBe("Algebra,Geometry"));
  });

  it("stores students & instructors arrays and triggers re-render", async () => {
    const { getByTestId } = render(
      <>
        <StudentCount />
        <InstructorCount />
      </>,
    );

    expect(getByTestId("stu-count").textContent).toBe("0");
    expect(getByTestId("inst-count").textContent).toBe("0");

    const {
      result: { current: profilesStore },
    } = renderHook(() => useProfilesStore());

    const sampleInstructor = { createdAt: "1970-01-01T00:00:00Z", id: 42, email: "test@tutor.com", name: "Test Tutor" };
    const sampleStudents = { ...sampleUser, createdAt: "1970-01-01T00:00:00Z", instructorId: 42 }

    act(() => {
      profilesStore.setStudents([sampleStudents]);
      profilesStore.setInstructors([sampleInstructor]);
    });

    await waitFor(() => {
      expect(getByTestId("stu-count").textContent).toBe("1");
      expect(getByTestId("inst-count").textContent).toBe("1");
    });
  });
});
