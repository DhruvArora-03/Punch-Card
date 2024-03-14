// @ts-ignore -- delete this line
import styles from "./Button.module.css";
import { Button, Spinner } from "react-bootstrap";

type ButtonProps = {
  className?: string;
  text?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  color?: "blue" | "red" | "green" | "yellow" | "gray";
  outline?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>; 
  href?: string;
};

const convert = {
  blue: "primary",
  red: "danger",
  green: "success",
  yellow: "warning",
  gray: "secondary",
};

export default function ButtonComponent(props: ButtonProps) {
  return (
    <Button
      as={props.href ? 'a': undefined}
      href={props.href}
      className={props.className}
      variant={
        (props.outline ? "outline-" : "") + convert[props.color ?? "blue"]
      }
      disabled={props.disabled || props.loading}
      type={props.type}
      onClick={props.onClick}
    >
      {props.loading ? <Spinner size="sm" /> : props.text}
    </Button>
  );
}
