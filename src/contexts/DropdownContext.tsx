import { createContext, Dispatch, SetStateAction } from "react";

interface DropdownContext {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export const DropdownContext = createContext<DropdownContext>({
  open: false,
  setOpen: () => { }
})