import axios, { AxiosResponse } from "axios";
import { useMemo, useState } from "react";
import { useAuthHeader, useSignOut } from "react-auth-kit"
import styles from './home.module.css';
import Button from "components/Button"
import { Navigate } from "react-router";

type setStateType<T> = React.Dispatch<React.SetStateAction<T>>
type setStatusType = setStateType<{
  name: string;
  isClockedIn: boolean;
  clockInTime: Date;
}>


async function wrapper(callback: () => Promise<any>,
  setError: setStateType<Error | null>,
  setIsLoading: setStateType<boolean>,
  setStatus: setStatusType
) {
  setIsLoading(true)
  setError(null)
  await callback()
    .then((response: AxiosResponse) =>
      setStatus({
        name: response.data.name,
        isClockedIn: response.data.is_clocked_in,
        clockInTime: new Date(response.data.clock_in_time)
      }))
    .catch((err) => {
      setError(err)
      !(axios.isAxiosError(err) && err.response?.status == 401) && console.log(err)
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
  const signOut = useSignOut()
  const authHeader = useAuthHeader()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
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

  if (axios.isAxiosError(error) && error.response?.status == 401) {
    signOut()
    return <Navigate to="/login" />
  }

  return <>
    {error && <h3>Error: {error.message}</h3>}
    <div className={styles.mainArea}>
      <h1>Welcome back {status.name}</h1>
      <h5>{isLoading ? "Loading..." : status.isClockedIn ? "You clocked in at " + status.clockInTime.toLocaleTimeString() : "You are not currently clocked in"}</h5>
      <Button className={styles.button} loading={isLoading} {...(status.isClockedIn ? clockOutProps : clockInProps)} />
    </div>
  </>

}