import { useParams } from "router";
import styles from "./users.module.css";
import { Formik } from "Formik";
import {
  convertUserFromDisplay,
  convertUserToDisplay,
  handleStaleAuthorization,
} from "lib/index";
import { useEffect, useState } from "react";
import { useAuthHeader, useSignOut } from "react-auth-kit";
import { Form } from "react-bootstrap";
import Button from "components/Button";
import { DisplayUser, InternalUser } from "lib/types";
import TextInput from "components/TextInput";
import axios, { AxiosResponse } from "axios";

export default function EditUser() {
  const authHeader = useAuthHeader();
  const signOut = useSignOut();
  const { user_id } = useParams("/users/view/:user_id");
  const [originalValues, setOriginalValues] = useState<DisplayUser>();
  const [error, setError] = useState<Error>();

  useEffect(() => handleStaleAuthorization(error, signOut), [error, signOut]);

  // get initial data
  useEffect(() => {
    const fetchData = async () =>
      await axios
        .get(`http://localhost:8080/users/${user_id}`, {
          headers: { Authorization: authHeader() },
        })
        .then((response: AxiosResponse) => response.data satisfies InternalUser)
        .then(convertUserToDisplay)
        .then(setOriginalValues)
        .catch(setError);

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id]);

  const submitUpdate = async (values: DisplayUser) => {
    await axios
      .put(
        `http://localhost:8080/users/${user_id}`,
        convertUserFromDisplay(values),
        {
          headers: { Authorization: authHeader() },
        }
      )
      .then(console.log);
  };

  return (
    <div className={styles.page}>
      <h1>Editing user with id: {user_id} </h1>
      <small>{error?.message}</small>

      {originalValues && (
        <Formik initialValues={originalValues} onSubmit={submitUpdate}>
          {({ handleSubmit, handleReset, handleBlur, isSubmitting }) => (
            <Form
              onSubmit={handleSubmit}
              onReset={handleReset}
              onBlur={handleBlur}
            >
              <TextInput field_id="username" />
              <TextInput field_id="first_name" />
              <TextInput field_id="last_name" />
              <TextInput field_id="hourly_pay" />
              <TextInput field_id="role" />
              <TextInput field_id="preferred_payment_method" />
              <Button
                color="blue"
                text="Save Changes"
                type="submit"
                loading={isSubmitting}
              />
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}
