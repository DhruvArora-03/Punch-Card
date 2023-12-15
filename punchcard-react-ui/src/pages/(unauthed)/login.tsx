import styles from "./login.module.css"
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export default function LoginPage() {
  return <div className={styles.page}>
    <div className={styles.mainArea}>
      <h1>Log In</h1>
      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon3">
          Username:
        </InputGroup.Text>
        <Form.Control id="basic-url" aria-describedby="basic-addon3" />
      </InputGroup>
    </div>
  </div>

}