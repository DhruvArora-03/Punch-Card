import { useAuthHeader } from "react-auth-kit";
import styles from "./users.module.css";
import { userDataType } from "lib/index";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Table } from "react-bootstrap";
import { useNavigate } from "router";

export default function ManageUsersPage() {
  const navigate = useNavigate();
  const authHeader = useAuthHeader();
  const [data, setData] = useState<userDataType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    () => {
      const fetchData = async () => {
        await axios
          .get("http://localhost:8080/users", {
            headers: { Authorization: authHeader() },
          })
          .then((response: AxiosResponse) => response.data)
          .then((data) => {
            console.log(data);
            if (data) {
              setData(
                data.map(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (d: any) =>
                    ({
                      user_id: d.UserID,
                      username: d.Username,
                      first_name: d.FirstName,
                      last_name: d.LastName,
                      hourly_pay: d.HourlyPay,
                      role: d.Role,
                      preferred_payment_method: d.PreferredPaymentMethod,
                    } satisfies userDataType)
                )
              );
            } else {
              setData([]);
            }
          });
      };

      setIsLoading(true);
      fetchData();
      setIsLoading(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className={styles.page}>
      <h1>Manage Users</h1>
      <h5>Click row to edit user</h5>
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
            {data.map((row) => (
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
