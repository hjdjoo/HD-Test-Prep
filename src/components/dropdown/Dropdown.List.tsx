
interface DropdownListProps {
  children: React.ReactNode
}

export default function DropdownList(props: DropdownListProps) {

  const { children } = props;

  return (
    <div>
      {children}
    </div>
  )
}