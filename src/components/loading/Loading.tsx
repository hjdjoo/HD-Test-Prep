import styles from "./Loading.module.css";
import animations from "@/src/animations.module.css"
import ModalContainer from "containers/modal/ModalContainer"

export default function Loading() {

  return (
    <ModalContainer>
      <span className={[
        styles.loader,
        animations.rotate,
      ].join(" ")} />
    </ModalContainer>
  )
}