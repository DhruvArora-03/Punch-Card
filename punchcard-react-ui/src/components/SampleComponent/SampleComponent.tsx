// @ts-ignore -- delete this line
import styles from "./SampleComponent.module.css";

type SampleComponentProps = {
  text?: string;
}

export default function SampleComponent(props: SampleComponentProps) {
  return <button>{props.text || "filler text"}</button>
}