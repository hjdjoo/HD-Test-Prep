import { create } from "zustand";

interface TagsState {
  tags: { [name: string]: number }
}

interface TagsActions {
  getTags: () => Promise<void>
  addTag: (tag: string) => Promise<number>
}

export const useTagStore = create<TagsState & TagsActions>()((set) => ({
  tags: {},
  getTags: async () => {

    const res = await fetch("/api/db/tags", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    const data: TagsState["tags"] = await res.json(); // should return transformed data: {[tag]: number}
    console.log("tagStore/getTags/data: ", data);

    set(() => ({ tags: data }))

  },
  addTag: async (tag: string) => {

    const request = {
      name: tag
    }

    const res = await fetch("/api/db/tags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    })

    const data: number = await res.json(); // should get back the tag ID.

    console.log(data);

    set((state) => ({
      tags: {
        ...state.tags,
        [tag]: data
      }
    }))

    return data;
  }
}))