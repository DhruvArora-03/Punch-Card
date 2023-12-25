import axios from "axios";
import { useMemo, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useAuthHeader } from "react-auth-kit"
import styles from './home.module.css';
import Button from "components/Button"

export default function HomePage() {
  const authHeader = useAuthHeader();
  const [isLoading, setIsLoading] = useState(false);

  useMemo(() => {
    setIsLoading(true)
    axios.get("http://localhost:8080/protected", {
      headers: {
        Authorization: authHeader()
      }
    }).then(() =>
      setIsLoading(false)
    ).catch((err) => {
      console.log(err)
    })
  }, [])

  if (isLoading) {
    return <Spinner />
  }

  return <>
    <h1>
      this is home page to be shown after user is logged in
    </h1>
    <Button className={styles.button} text="Clock In" />
  </>

}