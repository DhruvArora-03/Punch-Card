import { Link } from 'router'
import styles from './NavBar.module.css'
import logo from 'assets/gideon-logo.png'
import { NavBarModes } from '.';
import { useSignOut } from 'react-auth-kit';


type NavBarProps = {
  mode?: NavBarModes;
}

export default function NavBar({ mode }: NavBarProps) {
  const signOut = useSignOut();

  return <div className={styles.navbar}>
    <Link to="/home">
      <img src={logo} className={styles.logo} />
    </Link>

    <div className={styles.navbarItems}>
      {mode !== NavBarModes.UnAuthenticated &&
        <>
          <Link to="/history">History</Link>
          <Link to="/payments">Payments</Link>
          <Link to="/settings">Settings</Link>
          <Link to="/login" onClick={() => { signOut() }}>Log Out</Link>
        </>
      }
    </div>
  </div>
}