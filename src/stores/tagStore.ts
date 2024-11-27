import { create } from "zustand";

interface TagsState {
  tags: { [name: string]: number }
}

interface TagsActions {
  setTags: (tags: TagsState["tags"]) => void
}

export const useTagStore = create<TagsState & TagsActions>()((set) => ({
  tags: {},
  setTags: (tags) => {
    set(() => ({
      tags: tags
    }))
  }
}))