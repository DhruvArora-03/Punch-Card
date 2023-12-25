// @ts-ignore -- delete this line
import styles from "./SampleComponent.module.css";
import { Button, Spinner } from "react-bootstrap";

type ButtonProps = {
  className?: string,
  text?: string,
  disabled?: boolean,
  loading?: boolean,
  type?: "button" | "submit" | "reset",
  onClick?: React.MouseEventHandler<HTMLButtonElement>
};

export default function ButtonComponent(props: ButtonProps) {
  return <Button
    className={props.className}
    disabled={props.disabled || props.loading}
    type={props.type}
    onClick={props.onClick}
  >
    {props.loading
      ? <Spinner
        size="sm"
      />
      : props.text}
  </Button>
}