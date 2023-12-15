import styles from "./login.module.css"
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button'

export default function LoginPage() {
  return <div className={styles.page}>
    <div className={styles.mainArea}>
      <h1 className={styles.title}>Log In</h1>
      <InputGroup className={styles.input}>
        <InputGroup.Text> Username: </InputGroup.Text>
        <Form.Control />
      </InputGroup>
      <InputGroup className={styles.input}>
        <InputGroup.Text> Password: </InputGroup.Text>
        <Form.Control />
      </InputGroup>
      <Button className={styles.button}> Submit </Button>
    </div>
  </div>

}