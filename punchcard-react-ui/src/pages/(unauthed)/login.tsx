import axios, { AxiosResponse } from "axios";
import { useFormik } from "Formik";
import { useState } from "react";
import { useSignIn } from "react-auth-kit";
import { Form, FormControl, InputGroup } from "react-bootstrap";
import styles from "./login.module.css";
import Button from "components/Button";
import { hashPassword } from "lib/index";

export default function LoginPage() {
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);
  const signIn = useSignIn();


  const onSubmit = async (values: { username: string; password: string }) => {
    setError(undefined);
    setIsLoading(true);

    await hashPassword(values.password)
      .then((hashedPassword: string) =>
        axios.post("http://localhost:8080/login", {
          username: values.username,
          password: hashedPassword,
        })
      )
      .then((response: AxiosResponse) =>
        signIn({
          token: response.data.token,
          tokenType: "Bearer",
          expiresIn: 300,
          authState: {
            first_name: response.data.first_name,
            role: response.data.role,
          },
        })
      )
      .catch((err) => {
        setError(err);
        console.log("Error Message: ", err.message);
      });
    setIsLoading(false);
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit,
  });

  return (
    <div className={styles.page}>
      <Form className={styles.mainArea} onSubmit={formik.handleSubmit}>
        <h1 className={styles.title}>Log In</h1>
        <InputGroup className={styles.input}>
          <InputGroup.Text>Username: </InputGroup.Text>
          <FormControl
            id="username"
            autoComplete="on"
            onChange={formik.handleChange}
            value={formik.values.username}
          />
        </InputGroup>
        <InputGroup className={styles.input}>
          <InputGroup.Text>Password: </InputGroup.Text>
          <FormControl
            id="password"
            type="password"
            autoComplete="on"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
        </InputGroup>
        <Button
          className={styles.button}
          type="submit"
          loading={isLoading}
          text="Submit"
        />
      </Form>
    </div>
  );
}
