import axios from "axios";
import { useMemo, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useAuthHeader } from "react-auth-kit"
import styles from './home.module.css';
import Button from "components/Button"

type setStateType<T> = React.Dispatch<React.SetStateAction<T>>
type setStatusType = setStateType<{
  name: string;
  isClockedIn: boolean;
  clockInTime: Date;
}>


async function wrapper(callback: () => Promise<any>,
  setError: setStateType<string>,
  setIsLoading: setStateType<boolean>,
  setStatus: setStatusType
) {
  setIsLoading(true)
  await callback()
    .then((res) =>
      setStatus({
        name: res.data.name,
        isClockedIn: res.data.is_clocked_in,
        clockInTime: new Date(res.data.clock_in_time)
      }))
    .catch((err) => {
      setError(err.message)
      console.log(err)
    })
  setIsLoading(false)
}

function getStatus(authHeader: () => string) {
  return axios.get("http://localhost:8080/status",
    { headers: { Authorization: authHeader() } } // request config
  )
}

function clock(mode: "in" | "out", authHeader: () => string) {
  return axios.post("http://localhost:8080/clock-" + mode,
    { time: new Date().toJSON() }, // request body
    { headers: { Authorization: authHeader() } } // request config
  )
}

export default function HomePage() {
  const authHeader = useAuthHeader();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState({
    name: "",
    isClockedIn: false,
    clockInTime: new Date(0)
  });
  const clockInProps = {
    text: "Clock In",
    onClick: () => wrapper(() => clock("in", authHeader), setError, setIsLoading, setStatus)
  }
  const clockOutProps = {
    text: "Clock Out",
    onClick: () => wrapper(() => clock("out", authHeader), setError, setIsLoading, setStatus)
  }

  useMemo(() => wrapper(() => getStatus(authHeader), setError, setIsLoading, setStatus), [])

  return <>
    {error && <h3>Error: {error}</h3>}
    <div className={styles.mainArea}>
      <h1>Welcome back {status.name}</h1>
      <h5>{isLoading ? "Loading..." : status.isClockedIn ? "You clocked in at " + status.clockInTime.toLocaleTimeString() : "You are not currently clocked in"}</h5>
      <Button className={styles.button} loading={isLoading} {...(status.isClockedIn ? clockOutProps : clockInProps)} />
    </div>
  </>

}