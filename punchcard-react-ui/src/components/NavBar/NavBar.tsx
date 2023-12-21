import { Link } from 'router'
import styles from './NavBar.module.css'
import logo from 'assets/gideon-logo.png'
import { NavBarModes } from '.';


type NavBarProps = {
  mode?: NavBarModes;
}

export default function NavBar({ mode }: NavBarProps) {
  return <div className={styles.navbar}>
    <img src={logo} className={styles.logo} />
    <div className={styles.navbarItems}>
      {mode !== NavBarModes.UnAuthenticated &&
        <>
          <Link to="/">History</Link>
          <Link to="/">Payments</Link>
          <Link to="/">Settings</Link>
          <Link to="/logout">Log Out</Link>
        </>
      }
    </div>
  </div>
}