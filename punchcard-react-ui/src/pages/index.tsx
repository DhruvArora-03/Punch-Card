import { Navigate } from "../router";
import styles from "./Home.module.css"

export default function IndexPage() {
  return <Navigate className={styles.this_is_only_to_get_the_zero_margin_line_to_run} to="/login">Redirecting...</Navigate>;
}
