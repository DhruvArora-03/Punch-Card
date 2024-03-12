import { useParams } from "router";
import styles from "./users.module.css";
import { Formik } from "Formik";
import { handleStaleAuthorization } from "lib/index";
import { useEffect, useState } from "react";
import { useAuthHeader, useSignOut } from "react-auth-kit";
import { Form } from "react-bootstrap";
import Button from "components/Button";
import { UserDataDisplayType } from "lib/types";
import TextInput from "components/TextInput";
import axios, { AxiosResponse } from "axios";

export default function EditUser() {
  const authHeader = useAuthHeader();
  const signOut = useSignOut();
  const { user_id } = useParams("/users/:user_id");
  const [originalValues, setOriginalValues] = useState<UserDataDisplayType>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => handleStaleAuthorization(error, signOut), [error, signOut]);

  useEffect(() => {
    const fetchData = async () =>
      await axios
        .get(`http://localhost:8080/user/${user_id}`, {
          headers: { Authorization: authHeader() },
        })
        .then((response: AxiosResponse) => response.data)
        .then((data) => {
          console.log(data);
          setOriginalValues({
            username: data.Username,
            first_name: data.FirstName,
            last_name: data.LastName,
            hourly_pay: data.HourlyPayCents / 100,
            role: data.Role,
            preferred_payment_method: data.PreferredPaymentMethod,
          });
        })
        .catch(setError);

    setIsLoading(true);
    fetchData();
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id]);

  return (
    <div className={styles.page}>
      <h1>Editing user with id: {user_id} </h1>

      {originalValues && (
        <Formik initialValues={originalValues} onSubmit={(values) => {}}>
          {({ handleSubmit, handleReset, handleBlur, isSubmitting }) => (
            <Form
              onSubmit={handleSubmit}
              onReset={handleReset}
              onBlur={handleBlur}
            >
              <TextInput field_id="username" disabled={isLoading} />
              <TextInput field_id="first_name" disabled={isLoading} />
              <TextInput field_id="last_name" disabled={isLoading} />
              <TextInput field_id="hourly_pay" disabled={isLoading} />
              <TextInput field_id="role" disabled={isLoading} />
              <TextInput
                field_id="preferred_payment_method"
                disabled={isLoading}
              />
              <Button
                text="Save Changes"
                type="submit"
                loading={isLoading || isSubmitting}
              />
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}
