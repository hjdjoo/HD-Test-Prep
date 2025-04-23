import ModalContainer from "containers/modal/ModalContainer"
import LoadingSpinner from "./Loading.Spinner";

export default function Loading() {

  return (
    <ModalContainer>
      <LoadingSpinner />
    </ModalContainer>
  )
}