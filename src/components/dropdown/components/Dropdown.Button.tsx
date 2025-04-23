import { useContext } from "react";
import styles from "./Dropdown.module.css"
import { DropdownContext } from "@/src/contexts/DropdownContext";
import RightArrowIcon from "@/src/assets/icons/rightArrowIcon.svg"

interface DropdownButtonProps {
  id?: string
  children: React.ReactNode
}

export default function DropdownButton(props: DropdownButtonProps) {

  const { open, setOpen } = useContext(DropdownContext);

  const { id, children } = props;

  return (
    <button id={`${id || "dropdown-button"}`}
      className={[
        styles.buttonStyle,
        styles.buttonSize,
      ].join(" ")}
      onClick={(e) => {
        e.preventDefault();
        setOpen(!open);
      }}>
      <div className={[
        styles.flexRow,
        styles.buttonAlign,
      ].join(" ")}>
        {children}
        <div className={[
          styles.dropdownIcon,
          open ? styles.open : styles.close
        ].join(" ")}>
          <RightArrowIcon />
        </div>
      </div>
    </button>
  )
}