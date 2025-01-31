import { useState } from "react";
import { DropdownContext } from "@/src/contexts/DropdownContext";

import DropdownButton from "./components/Dropdown.Button";
import DropdownList from "./components/Dropdown.List";
import DropdownItem from "./components/Dropdown.Item";

interface DropdownChildren {
  Button: typeof DropdownButton
  List: typeof DropdownList
  Item: typeof DropdownItem
}

interface DropdownProps {
  id?: string
  children: React.ReactNode
}

function DropdownComponent(props: DropdownProps) {

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { children } = props;

  return (
    <DropdownContext.Provider
      value={{ open: isOpen, setOpen: setIsOpen }}>
      {children}
    </DropdownContext.Provider>
  )

}

const ChildComponents: DropdownChildren = {
  Button: DropdownButton,
  List: DropdownList,
  Item: DropdownItem
}

const Dropdown = Object.assign(DropdownComponent, ChildComponents)

export default Dropdown;
