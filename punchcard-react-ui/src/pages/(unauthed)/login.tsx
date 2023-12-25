import axios, { AxiosError, AxiosResponse } from 'axios';
import { useFormik } from 'Formik';
import { useState } from 'react';
import { useSignIn } from 'react-auth-kit';
import { Form, InputGroup } from 'react-bootstrap';
import styles from './login.module.css';
import Button from 'components/Button';

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const signIn = useSignIn();
  const encoder = new TextEncoder();

  const hashPassword = async (password: string) => {
    // encode
    const passwordBuffer = encoder.encode(password);
    // hash
    return window.crypto.subtle.digest("SHA-256", passwordBuffer)
      // decode
      .then((hashBuffer) => Array.from(new Uint8Array(hashBuffer)).map(byte => byte.toString(16).padStart(2, '0')).join(''))
  };

  const onSubmit = async (values: any) => {
    console.log("Values: ", values)
    setError("")
    setIsLoading(true)

    await hashPassword(values.password)
      .then((hashedPassword: string) => axios.post(
        "http://localhost:8080/login",
        {
          username: values.username,
          password: hashedPassword
        }
      ))
      .then((response: AxiosResponse) => signIn({
        token: response.data,
        tokenType: "Bearer",
        expiresIn: 300,
        authState: { username: values.username },
      }))
      .catch((err) => {
        if (err instanceof AxiosError) {
          setError(err.response?.data.message)
        } else if (err instanceof Error) {
          setError(err.message)
        }
        console.log("Error: ", err);
      })
      .then(() => setIsLoading(false))
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
          id="username"
          onChange={formik.handleChange}
          value={formik.values.username}
        />
      </InputGroup>
      <InputGroup className={styles.input}>
        <InputGroup.Text> Password: </InputGroup.Text>
        <Form.Control
          id="password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
      </InputGroup>
      <Button className={styles.button} type="submit" loading={isLoading} text="Submit" />
    </Form>
  </div>

}