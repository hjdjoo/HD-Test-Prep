import styles from "./Dropdown.module.css";

interface DropdownItemProps {
  onClick: () => void
  id?: string
  idx: number
  selectedIdx: number | null
  children: React.ReactNode
}

export default function DropdownItem(props: DropdownItemProps) {

  const { id, idx, selectedIdx, children, onClick } = props;

  return (
    <div id={id || undefined}
      className={[
        styles.cursorHover,
        idx === selectedIdx ? styles.selected : "",
      ].join(" ")}
      onClick={onClick}>
      {children}
    </div>
  )
}