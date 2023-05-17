import Link from "next/link";
import styles from "@/styles/Navbar.module.css";
import Loginbtn from "./loginBtn";
import { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";


const Navbar = ({ user }) => {

    const [menuActive, setMenuActive] = useState(false);

    // here we are getting the first and last initial of the user's name
    const nameParts = user.name.split(" ");
    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    const initials = firstInitial + lastInitial;

    if (user.role === "admin") {
        return (
            <div className={styles.navBar}>
                <div className={styles.navBarLogo}>
                    <Link href="/">
                        Scheduling 
                    </Link>
                </div>
                <div className={`${styles.navBarLinks} ${styles.hideOnTablet} `}>
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
                <Loginbtn initials={initials} name={user.name} hide={true} />
                <div className={styles.menuBar} onClick={() => setMenuActive(!menuActive)}>
                    <AiOutlineMenu />
                </div>
                <div className={`${menuActive ? styles.menuActive : ""} ${styles.menuList}`}>

                    <Link href="/">
                        Front Page
                    </Link>
                    <Link href="/schedule">
                        Work Schedule
                    </Link>
                    <Link href="/admin">
                        Admin
                    </Link>
                    <Link href="/profile">
                        Profile
                    </Link>
                    <Loginbtn initials={initials} name={user.name} hide={false} menu={true} />
                    <AiOutlineClose onClick={() => setMenuActive(!menuActive)} />
                </div>
            </div>
        );
    } else {
        return (
            <div className={styles.navBar}>
                <div className={styles.navBarLogo}>
                    <Link href="/">
                    Scheduling
                    </Link>
                </div>
                <div className={styles.navBarLinks}>
                    <Link href="/" className={styles.navBarLink}>
                        Front Page
                    </Link>
                    <Link href="/schedule" className={styles.navBarLink}>
                        Work Schedule
                    </Link>
                </div>
                <Loginbtn initials={initials} name={user.name} hide={true} />
            </div>
        );
    }
};

export default Navbar;