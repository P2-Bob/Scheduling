import Link from "next/link";
import styles from "@/styles/Navbar.module.css";
import Loginbtn from "./loginBtn";


const Navbar = ({ name }) => {

    // here we are getting the first and last initial of the user's name
    const nameParts = name.split(" ");
    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    const initials = firstInitial + lastInitial;

  return (
    <div className={styles.navBar}>
        <div className={styles.navBarLogo}>
            <Link href="/">
                  My Website
            </Link>
        </div>
        <div className={styles.navBarLinks}>
            <Link href="/" className={styles.navBarLink}>
                Front Page
            </Link>
            <Link href="/schedule" className={styles.navBarLink}>
                Work Schedule
            </Link>
            <Link href="/admin" className={styles.navBarLink}>
                Admin
            </Link>
        </div>
        <Loginbtn initials={initials} name={name} />
    </div>
  );
};

export default Navbar;