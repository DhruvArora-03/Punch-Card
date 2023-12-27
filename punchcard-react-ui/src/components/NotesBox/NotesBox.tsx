import { setStateType } from "utils";
import styles from './NotesBox.module.css'
import { Spinner } from "react-bootstrap";

type NotesBoxProps = {
  text: string,
  onTextChange: setStateType<string>;
  disabled?: boolean
  loading?: boolean
}

export default function NotesBox(props: NotesBoxProps) {
  return <div className={styles.notesBox}>
    <textarea
      name="notesBox"
      className={styles.textArea}
      value={props.text}
      onChange={(e) => props.onTextChange(e.target.value)}
      placeholder="Enter shift notes"
      disabled={props.disabled}
    />
    {props.loading && <Spinner className={styles.spinner} size="sm" />}
  </div>
}