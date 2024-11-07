import { create } from "zustand";


export interface Tag {
  id: number
  tag: string
}

interface Tags {
  tags: []
}