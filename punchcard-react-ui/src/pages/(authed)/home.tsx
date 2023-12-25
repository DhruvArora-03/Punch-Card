import axios from "axios";
import { useMemo, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useAuthHeader } from "react-auth-kit"
import styles from './home.module.css';
import Button from "components/Button"

async function clockIn(authHeader: () => string, setError: React.Dispatch<React.SetStateAction<string>>) {
  await axios.post("http://localhost:8080/clock-in",
    {
      time: new Date().toJSON()
    },
    {
      headers: {
        Authorization: authHeader()
      }
    }
  ).catch((err) => {
    setError(err.message)
    console.log(err)
  })
}

export default function HomePage() {
  const authHeader = useAuthHeader();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");


  useMemo(async () => {
    setIsLoading(true)
    await axios.get("http://localhost:8080/protected", {
      headers: {
        Authorization: authHeader()
      }
    }).catch((err) => {
      setError(err.message)
      console.log(err)
    })
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <Spinner />
  }

  return <>
    {/* <h1>
      this is home page to be shown after user is logged in
    </h1> */}
    {error && <h3>Error: {error}</h3>}
    <div className={styles.mainArea}>
      <h1>Welcome back Name</h1>
      <Button className={styles.button} text="Clock In" onClick={() => clockIn(authHeader, setError)} />
    </div>
  </>

}