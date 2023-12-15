import { Link } from 'router'
import styles from './NavBar.module.css'
import logo from 'assets/gideon-logo.png'

export default function NavBar() {
  return <div className={styles.navbar}>
    <img src={logo} className={styles.logo} />
    <div className={styles.navbarItems}>
      <Link to="/login">Past Payments</Link>
      <Link to="/login">Settings</Link>
    </div>
  </div>
}