import { useParams } from "router";
import styles from "./users.module.css";

export default function EditUser() {
  const { user_id } = useParams("/users/:user_id");

  return (
    <div className={styles.page}>
      <h1> hi {user_id} </h1>
    </div>
  );
}
