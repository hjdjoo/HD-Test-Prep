interface DropdownItemProps {
  onClick: () => void
  children: React.ReactNode
}

export default function DropdownItem(props: DropdownItemProps) {

  const { children, onClick } = props;

  return (
    <div onClick={onClick}>
      {children}
    </div>
  )
}