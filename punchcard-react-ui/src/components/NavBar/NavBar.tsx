import { Link } from "router";
import styles from "./NavBar.module.css";
import logo from "assets/gideon-logo.png";
import { NavBarModes } from ".";
import { useSignOut } from "react-auth-kit";
import { ReactNode } from "react";
import { useLocation } from "react-router";
import classNames from "classnames";

type NavBarProps = {
  mode?: NavBarModes;
};

// type PropsFrom<Link> = Link extends React.FC<infer Props> ? Props : never;

type NavBarItemProps = {
  to: string;
  children: ReactNode;
  onClick?: () => void;
};

export default function NavBar(props: NavBarProps) {
  const signOut = useSignOut();
  const location = useLocation();

  const Item = (itemProps: NavBarItemProps) => (
    <Link
      className={classNames(
        styles.item,
        location.pathname === itemProps.to && styles.activeItem
      )}
      to={itemProps.to as any} // eslint-disable-line @typescript-eslint/no-explicit-any
      onClick={itemProps.onClick}
    >
      {itemProps.children}
    </Link>
  );

  return (
    <div className={styles.navbar}>
      <Item to="/">
        <img src={logo} className={styles.logo} />
      </Item>

      <div className={styles.navbarItems}>
        {props.mode !== NavBarModes.UnAuthenticated && (
          <>
            <Item to="/home">Home</Item>
            <Item to="/history">Shift History</Item>
            <Item to="/payments">Payments</Item>
            {props.mode == NavBarModes.Admin && (
              <Item to="/users">Users</Item>
            )}
            <Item to="/settings">Settings</Item>
            <Item to="/login" onClick={signOut}>
              Log Out
            </Item>
          </>
        )}
      </div>
    </div>
  );
}
