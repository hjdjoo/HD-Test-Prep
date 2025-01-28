
interface AdminContainerProps {
  children?: React.ReactNode
}

export default function AdminContainer(props: AdminContainerProps) {

  const { children } = props;

  return (
    <div id="admin-container">
      {children && children}
    </div>
  )


}