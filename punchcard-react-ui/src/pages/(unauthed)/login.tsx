import styles from "./login.module.css"
import RBForm from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button'
// import { Formik, Field, Form } from "RBFormik";

export default function LoginPage() {
  return <div className={styles.page}>
    <RBForm className={styles.mainArea}>
      <h1 className={styles.title}>Log In</h1>
      <InputGroup className={styles.input}>
        <InputGroup.Text> Username: </InputGroup.Text>
        <RBForm.Control />
      </InputGroup>
      <InputGroup className={styles.input}>
        <InputGroup.Text> Password: </InputGroup.Text>
        <RBForm.Control />
      </InputGroup>
      <Button className={styles.button} /* onClick={() =>  signIn({ username: "temp" }) }*/> Submit </Button>
    </RBForm>
  </div>

}