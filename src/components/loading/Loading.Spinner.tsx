import styles from "./Loading.module.css";
import animations from "@/src/animations.module.css";

interface SpinnerProps {
  styles?: string[]
}

export default function Spinner(props: SpinnerProps) {

  const spinnerStyles = props.styles || [];

  return (
    <span id="loading-spinner" className={[
      styles.loader,
      animations.rotate,
      ...spinnerStyles,
    ].join(" ")} />
  )
}