import Link from "next/link";
import styles from "@/styles/Navbar.module.css";
import Loginbtn from "./loginBtn";


const Navbar = ({ initials }) => {

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
        <Loginbtn initials={initials} />
    </div>
  );
};

export default Navbar;