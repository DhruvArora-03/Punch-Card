import { Formik } from "Formik";
import styles from "./users.module.css";
import axios from "axios";
import BackLink from "components/BackLink";
import Button from "components/Button";
import TextInput from "components/TextInput";
import {
  convertUserFromDisplayForApi,
  handleStaleAuthorization,
} from "lib/index";
import { useEffect, useState } from "react";
import { useAuthHeader, useSignOut } from "react-auth-kit";
import { Form } from "react-router-dom";
import { NewUserSchema } from "lib/validation";
import { DisplayUser } from "lib/types";

export default function CreateUserPage() {
  const authHeader = useAuthHeader();
  const signOut = useSignOut();
  const [error, setError] = useState<Error>();

  const submitCreate = async (values: DisplayUser) => {
    console.log("REACHED");
    console.log(convertUserFromDisplayForApi(values));
    await axios
      .post(
        "http://localhost:8080/users",
        { password: "password", ...convertUserFromDisplayForApi(values) },
        {
          headers: { Authorization: authHeader() },
        }
      )
      .then(console.log)
      .catch(setError);
  };

  useEffect(() => handleStaleAuthorization(error, signOut), [error, signOut]);

  return (
    <div className={styles.page}>
      <BackLink to="/users" />
      <h1>Creating new user</h1>
      <small>{error?.message}</small>
      <Formik
        initialValues={
          {
            username: "",
            first_name: "",
            last_name: "",
            hourly_pay: 12.34,
            role: "",
            preferred_payment_method: "",
          } satisfies DisplayUser
        }
        onSubmit={submitCreate}
        // validationSchema={NewUserSchema}
      >
        {({ handleSubmit, handleReset, isSubmitting }) => (
          <Form
            className={styles.form}
            onSubmit={handleSubmit}
            onReset={handleReset}
          >
            <TextInput field_id="username" />
            <TextInput field_id="first_name" />
            <TextInput field_id="last_name" />
            <TextInput field_id="hourly_pay" />
            <TextInput field_id="role" />
            <TextInput field_id="preferred_payment_method" />
            <Button
              color="blue"
              text="Create User"
              type="submit"
              loading={isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
}
