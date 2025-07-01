import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from "vitest";
import { mockError } from "@/src/_const/testConst";

vi.mock("@/src/config", () => ({
  SERVER_URL: "https://api.test",            // constant base URL
}));

const apiFetch = vi.fn();
vi.mock("@/utils/apiFetch", () => ({ apiFetch }));

// utility functions

async function load<T>(path: string): Promise<T> {
  return await import(path).then((m) => m.default as unknown as T);
}

async function itThrows(path: string) {
  apiFetch.mockResolvedValueOnce(mockError);

  const fn = await load<() => Promise<any>>(path)

  await expect(fn).rejects.toThrow();
}

beforeEach(() => apiFetch.mockClear());

/* ================================================================== */
/* 3 ▸  getCategories, getProblemTypes, getQuestions, getTags          */
/* ================================================================== */
describe("simple list queries", () => {

  const specs: [string, string][] = [
    ["getCategories", "/db/categories"],
    ["getProblemTypes", "/db/problem_types"],
    ["getQuestions", "/db/questions"],
    ["getTags", "/db/tags/all"],
  ];

  specs.forEach(([file, endpoint]) => {

    it(`${file} returns JSON array`, async () => {
      apiFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(["x"]),
      });

      const fn = await load<() => Promise<any>>(
        `@/src/queries/GET/${file}`,
      );
      const data = await fn();

      expect(apiFetch).toHaveBeenCalledWith(
        `https://api.test${endpoint}`,
        expect.any(Object),
      );
      expect(data).toEqual(["x"]);
    });

    it(`${file} throws on !ok`, async () => {
      apiFetch.mockResolvedValueOnce(
        mockError
      );
      const fn = await load<() => Promise<any>>(
        `@/src/queries/GET/${file}`,
      );

      await expect(fn()).rejects.toThrow();
    });
  });
});

describe("getPracticeSession", () => {

  it("throws when !res.ok", async () => {

    await itThrows("@/src/queries/GET/getPracticeSession");

  })

  it("returns parsed session object when body present", async () => {
    apiFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve('{"id":999}'),
    });

    const getPracticeSession = await load<(u: number) => Promise<any>>(
      "@/src/queries/GET/getPracticeSession",
    );
    const data = await getPracticeSession(7);

    expect(apiFetch).toHaveBeenCalledWith(
      "https://api.test/db/practice_session/7",
    );
    expect(data).toEqual({ id: 999 });
  });

  it("returns null when body empty", async () => {
    apiFetch.mockResolvedValueOnce({ ok: true, text: () => Promise.resolve("") });

    const getPracticeSession = await load<(u: number) => Promise<any>>(
      "@/src/queries/GET/getPracticeSession",
    );
    expect(await getPracticeSession(1)).toBeNull();
  });
});

describe("getResponsesById", () => {

  it("throws when !res.ok", async () => {

    await itThrows("@/src/queries/GET/getResponsesById");

  })

  it("returns an empty array if no ids are passed", async () => {

    const getResponsesById = await load<(ids: number[]) => Promise<any>>(
      "@/src/queries/GET/getResponsesById"
    )

    const data = await getResponsesById([]);

    expect(data).toStrictEqual([]);

  })

  it("builds comma list", async () => {
    apiFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{ id: 1 }]),
    });

    const getById = await load<(ids: number[]) => Promise<any>>(
      "@/src/queries/GET/getResponsesById",
    );
    const res = await getById([1, 2, 3]);

    expect(apiFetch).toHaveBeenCalledWith(
      "https://api.test/db/student_responses/?ids=1,2,3",
      expect.any(Object),
    );
    expect(res).toHaveLength(1);
  });

});

describe("getResponsesBySession", () => {

  it("throws when !res.ok", async () => {

    await itThrows("@/src/queries/GET/getResponsesBySession")

  })

  it("getResponsesBySession parses text → JSON", async () => {
    apiFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve('[{"id":1}]'),
    });

    const getResponsesBySession = await load<(ids: number) => Promise<any[]>>(
      "@/src/queries/GET/getResponsesBySession"
    )

    const res = await getResponsesBySession(77);

    expect(apiFetch).toHaveBeenCalledWith(
      "https://api.test/db/student_responses/77",
    );
    expect(res).toEqual([{ id: 1 }]);
  });
});

describe("profile queries", () => {
  it("getStudents returns student list", async () => {
    apiFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{ id: 1 }]),
    });

    const getStudents = await load<() => Promise<any>>(
      "@/src/queries/GET/getStudents",
    );
    expect(await getStudents()).toEqual([{ id: 1 }]);
    expect(apiFetch).toHaveBeenCalledWith(
      "https://api.test/db/profiles/students",
      expect.any(Object),
    );
  });

  it("getInstructors returns instructor list", async () => {
    apiFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{ id: 2 }]),
    });

    const getInstructors = await load<() => Promise<any>>(
      "@/src/queries/GET/getInstructors",
    );
    expect(await getInstructors()).toEqual([{ id: 2 }]);
    expect(apiFetch).toHaveBeenCalledWith(
      "https://api.test/db/profiles/instructors",
      expect.any(Object),
    );
  });
});

describe("getFeedbackById", () => {
  it("queries endpoint and returns JSON", async () => {
    apiFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 5 }),
    });

    const getFeedbackById = await load<(id: number) => Promise<any>>(
      "@/src/queries/GET/getFeedbackById",
    );
    expect(await getFeedbackById(5)).toEqual({ id: 5 });
    expect(apiFetch).toHaveBeenCalledWith(
      "https://api.test/db/feedback/5",
    );
  });
});

describe("getTagsById", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  })

  it("throws if response is not ok", async () => {

    await itThrows("@/src/queries/GET/getTagsById")

  })

  it("queries a list of tags by Id and returns an object", async () => {

    apiFetch.mockResolvedValueOnce({
      ok: true,
      json: () => ({
        "tag1": "1",
        "tag2": "2",
        "tag3": "3"
      })
    })

    const getTagsById = await load<(ids: number[]) => Promise<any>>("@/src/queries/GET/getTagsById");

    const testTags = [1, 2, 3]

    const data = await getTagsById(testTags);

    expect(apiFetch).toHaveBeenCalledWith(`https://api.test/db/tags?ids=${testTags.join(",")}`);

    expect(data).toBeInstanceOf(Object);

  })
})