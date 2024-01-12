import axios, { AxiosResponse } from "axios";
import { useEffect, useMemo, useState } from "react";
import { useAuthHeader, useAuthUser, useSignOut } from "react-auth-kit"
import styles from './home.module.css';
import Button from "components/Button"
import NotesBox from "components/NotesBox";
import { apiWrapper, formatClockedInMessage } from "lib";

function getStatus(authHeader: () => string) {
  return axios.get("http://localhost:8080/status",
    { headers: { Authorization: authHeader() } } // request config
  ).then((response: AxiosResponse) => response.data)
}

function clockIn(authHeader: () => string) {
  return axios.post("http://localhost:8080/clock-in",
    { time: new Date().toJSON() }, // request body
    { headers: { Authorization: authHeader() } } // request config
  ).then((response: AxiosResponse) => response.data)
}

function saveNotes(authHeader: () => string, notes: string) {
  return axios.put("http://localhost:8080/clock-notes",
    { notes }, // request body
    { headers: { Authorization: authHeader() } } // request config
  ).then((response: AxiosResponse) => response.data)
}

function clockOut(authHeader: () => string, notes: string) {
  return axios.post("http://localhost:8080/clock-out",
    {
      // request body
      time: new Date().toJSON(),
      notes
    },
    { headers: { Authorization: authHeader() } } // request config
  ).then((response: AxiosResponse) => response.data)
}


export default function HomePage() {
  const signOut = useSignOut()
  const authHeader = useAuthHeader()
  const authState = useAuthUser()
  const [oldNotes, setOldNotes] = useState("")
  const [notes, setNotes] = useState("")
  const [isNotesLoading, setIsNotesLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [status, setStatus] = useState({
    is_clocked_in: false,
    clock_in_time: ""
  });

  const name = useMemo(() => authState()?.first_name ?? "", [authState])

  useMemo(() =>
    apiWrapper(
      () => getStatus(authHeader)
        .then((d: {
          notes: string;
          is_clocked_in: boolean;
          clock_in_time: string;
        }) => {
          const { notes, ...data } = d;
          setStatus(data)
          setNotes(notes)
          setOldNotes(notes)
        }),
      setError,
      setIsLoading
    ), [])

  useEffect(() => {
    if (axios.isAxiosError(error) && error.response?.status == 401) {
      signOut()
    }
  }, [error])


  return <>
    {error && <h3>Error: {error.message}</h3>}
    <div className={styles.page}>
      <div className={styles.mainArea}>
        <h1 className={styles.title}>Welcome back {name}</h1>
        <h2 className={styles.text}>
          {isLoading
            ? "Loading..."
            : status.is_clocked_in
              ? formatClockedInMessage(new Date(status.clock_in_time))
              : "You are not currently clocked in"}
        </h2>

        {!status.is_clocked_in
          ? <Button
            className={styles.mainButton}
            loading={isLoading}
            text="Clock In"
            color="green"
            onClick={() =>
              apiWrapper(
                () => clockIn(authHeader)
                  .then((data: { is_clocked_in: boolean, clock_in_time: string }) => {
                    setStatus(data)
                    setNotes("")
                    setOldNotes("")
                  }),
                setError,
                setIsLoading
              )
            }
          />
          : <>
            <NotesBox
              disabled={isLoading || isNotesLoading}
              text={notes}
              onTextChange={setNotes}
            />
            <Button
              className={styles.notesButton}
              loading={isNotesLoading}
              disabled={isLoading || notes == oldNotes}
              text="Save Notes"
              color="blue"
              onClick={() =>
                apiWrapper(
                  () => saveNotes(authHeader, notes).then(() => setOldNotes(notes)),
                  setError,
                  setIsNotesLoading
                )
              }
            />
            <Button
              className={styles.mainButton}
              loading={status.is_clocked_in && isLoading}
              disabled={!status.is_clocked_in || isLoading || isNotesLoading}
              text={(notes == oldNotes ? "" : "Save Notes and ") + "Clock Out"}
              color="green"
              onClick={() =>
                apiWrapper(
                  () => clockOut(
                    authHeader,
                    notes
                  ).then(
                    (data: { is_clocked_in: boolean, clock_in_time: string }) => {
                      setStatus(data)
                      setNotes("")
                      setOldNotes("")
                    }
                  ),
                  setError,
                  setIsLoading
                )
              }
            />
          </>
        }
      </div>
    </div>
  </>

}