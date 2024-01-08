import { setStateType } from "lib/index";
import styles from './NotesBox.module.css'

type NotesBoxProps = {
  text: string,
  onTextChange: setStateType<string>;
  disabled?: boolean
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
    {/* {props.loading && <Spinner className={styles.spinner} size="sm" />} */}
  </div>
}