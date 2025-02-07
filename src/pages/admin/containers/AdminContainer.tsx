import styles from "./AdminContainer.module.css";
import { User } from "@/src/stores/userStore";

interface AdminContainerProps {
  user: User
  children?: React.ReactNode
}

export default function AdminContainer(props: AdminContainerProps) {

  const { children } = props;

  return (
    <div id="admin-container"
      className={[
        styles.containerWidth,
      ].join(" ")}
    >
      {children && children}
    </div>
  )

}