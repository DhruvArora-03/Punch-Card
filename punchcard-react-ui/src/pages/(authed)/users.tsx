import { useAuthHeader } from "react-auth-kit";
import styles from "./users.module.css";
import { userDataType } from "lib/index";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

export default function ManageUsersPage() {
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
      isLoading: {`${isLoading}`}
      <br />
      {JSON.stringify(data)}
    </div>
  );
}
