import { Dispatch, SetStateAction, useState, useContext } from "react";
import { DropdownContext } from "@/src/contexts/DropdownContext";

import DropdownButton from "./Dropdown.Button";
import DropdownList from "./Dropdown.List";
import DropdownItem from "./Dropdown.Item";

interface DropdownChildren {
  Button: typeof DropdownButton
  List: typeof DropdownList
  Item: typeof DropdownItem
}

interface DropdownProps {
  children: React.ReactNode
}

function DropdownComponent(props: DropdownProps) {

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { children } = props;

  return (
    <DropdownContext.Provider value={{ open: isOpen, setOpen: setIsOpen }}>
      <div onClick={() => {
        setIsOpen(!isOpen)
      }}>Select An Option:</div>
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
