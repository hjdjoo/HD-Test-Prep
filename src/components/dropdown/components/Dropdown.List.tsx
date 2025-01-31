import { useContext } from "react";
import { DropdownContext } from "@/src/contexts/DropdownContext";


interface DropdownListProps {
  id?: string
  className?: string
  children: React.ReactNode
}

export default function DropdownList(props: DropdownListProps) {

  const { open } = useContext(DropdownContext)

  const { id, className, children } = props;

  return (
    <div id={id || undefined}
      className={`${className || ""}`}
      style={{ position: "relative", textAlign: "right" }}>
      {open && children}
    </div>
  )
}