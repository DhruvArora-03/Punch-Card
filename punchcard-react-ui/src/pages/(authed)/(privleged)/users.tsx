import { useAuthHeader, useSignOut } from "react-auth-kit";
import styles from "./users.module.css";
import { convertUserToDisplay, handleStaleAuthorization } from "lib/index";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Table } from "react-bootstrap";
import { useNavigate } from "router";
import { DisplayUser, InternalUser } from "lib/types";

export default function ViewUsersPage() {
  const navigate = useNavigate();
  const authHeader = useAuthHeader();
  const signOut = useSignOut();
  const [data, setData] = useState<DisplayUser[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => handleStaleAuthorization(error, signOut), [error, signOut]);

  useEffect(
    () => {
      const fetchData = async () =>
        await axios
          .get("http://localhost:8080/users", {
            headers: { Authorization: authHeader() },
          })
          .then((response: AxiosResponse) => response.data)
          .then((data: InternalUser[]) => {
            console.log(data);
            setData(data.map(convertUserToDisplay));
          })
          .catch(setError);

      setIsLoading(true);
      fetchData();
      setIsLoading(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className={styles.page}>
      <h1>View Users</h1>
      <h5>Click row to see more</h5>
      {!isLoading && (
        <Table striped hover bordered>
          <thead>
            <tr>
              <th>id #</th>
              <th>Username</th>
              <th>First</th>
              <th>Last</th>
              <th>Hourly Pay</th>
              <th>Role</th>
              <th>Prefferred Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((row: DisplayUser) => (
                <tr
                  key={row.user_id}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onClick={() => navigate(`/users/${row.user_id}` as any)}
                >
                  {Object.values(row).map((item, i) => (
                    <td key={`${i} - ${item}`}>{item}</td>
                  ))}
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
