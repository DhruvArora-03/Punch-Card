import styles from "./login.module.css"
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button'
import { useFormik } from "Formik";
import { useSignIn } from 'react-auth-kit'
import { useState } from "react";
import axios, { AxiosError } from "axios";

export default function LoginPage() {
  const [error, setError] = useState("");
  const signIn = useSignIn();

  const onSubmit = async (values: any) => {
    console.log("Values: ", values);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/login",
        values
      );

      signIn({
        token: response.data.token,
        tokenType: "Bearer",
        expiresIn: 300,
        authState: { username: values.username },
      });
    } catch (err) {
      if (err && err instanceof AxiosError)
        setError(err.response?.data.message);
      else if (err && err instanceof Error) setError(err.message);

      console.log("Error: ", err);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: ""
    },
    onSubmit
  })

  return <div className={styles.page}>
    <Form className={styles.mainArea} onSubmit={formik.handleSubmit}>
      <h1 className={styles.title}>Log In</h1>
      <InputGroup className={styles.input}>
        <InputGroup.Text> Username: </InputGroup.Text>
        <Form.Control
          onChange={formik.handleChange}
          value={formik.values.username}
        />
      </InputGroup>
      <InputGroup className={styles.input}>
        <InputGroup.Text> Password: </InputGroup.Text>
        <Form.Control
          onChange={formik.handleChange}
          value={formik.values.password}
        />
      </InputGroup>
      <Button className={styles.button} /* onClick={() =>  signIn({ username: "temp" }) }*/> Submit </Button>
    </Form>
  </div>

}