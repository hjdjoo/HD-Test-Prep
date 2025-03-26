import styles from "./ModalContainer.module.css"

interface ModalContainerProps {
  children: React.ReactNode
}

export default function ModalContainer(props: ModalContainerProps) {

  const { children } = props;

  return (
    <div id="modal-backdrop"
      className={[
        styles.backdropStyle,
        styles.centerForm,
      ].join(" ")}>
      <div id="modal-content-container"
        className={[
          styles.modalContentPosition
        ].join(" ")}>
        {children}
      </div>
    </div>

  )
}