import { Link } from 'router'
import styles from './NavBar.module.css'
import logo from 'assets/gideon-logo.png'
import { NavBarModes } from '.';
import { useSignOut } from 'react-auth-kit';
import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router';
import classNames from 'classnames';


type NavBarProps = {
  mode?: NavBarModes;
}

type NavBarItemProps = {
  to: string,
  children: ReactNode,
  onClick?: () => any
}


export default function NavBar(props: NavBarProps) {
  const signOut = useSignOut();
  const location = useLocation();

  useEffect(() => { }, [location.pathname])

  function Item(itemProps: NavBarItemProps) {
    return <Link
      className={classNames(styles.item, location.pathname == itemProps.to && styles.activeItem)}
      to={itemProps.to as any}
      onClick={itemProps.onClick}>
      {itemProps.children}
    </Link>
  }

  return <div className={styles.navbar}>
    <Item to="/">
      <img src={logo} className={styles.logo} />
    </Item>

    <div className={styles.navbarItems}>
      {props.mode !== NavBarModes.UnAuthenticated &&
        <>
          <Item to="/home">Home</Item>
          <Item to="/history">History</Item>
          <Item to="/payments">Payments</Item>
          <Item to="/settings">Settings</Item>
          <Item to="/login" onClick={signOut}>Log Out</Item>
        </>
      }
    </div>

  </div>
}