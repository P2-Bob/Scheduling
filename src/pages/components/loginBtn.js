import { useSession, signIn, signOut } from "next-auth/react"
import styles from "@/styles/LoginBtn.module.css"
import { AiOutlineDown } from "react-icons/ai"
import { useState } from "react"
import Link from "next/link"



export default function Component({ initials, name, menu }) {
    const { data: session } = useSession()
    const [profileDropDown, setProfileDropDown] = useState(false)

    const handleMouseEnter = () => {
        setProfileDropDown(true);
    }

    const handleMouseLeave = () => {
        setProfileDropDown(false);
    }

    if (session) {
        if (!menu) {
            return (
                <div className={`${styles.loggedIn} ${styles.hideOnTablet}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <p className={`${styles.name} ${styles.hideOnMobile}`}>
                        {name}
                    </p>
                    <AiOutlineDown className={`${styles.icon} ${styles.hideOnMobile}`} />
                    <div className={styles.avatar}>
                        {initials}
                    </div>
                    {profileDropDown &&
                        <div className={styles.dropDown}>
                            <Link href="/profile">
                                <p className={styles.dropDownItem}>Profile</p>
                            </Link>
                            <p className={styles.dropDownItem} onClick={() => signOut()}>Sign out</p>
                        </div>
                    }
                </div>
            )
        } else {
            return (
                <div className={styles.loggedInMenu}>
                    <div className={styles.avatarMobile}>
                        {initials}
                    </div>
                    <p className={styles.nameMobile}>
                        {name}
                    </p>
                    <p className={styles.signOut} onClick={() => signOut()}>Sign out</p>
                </div>
            )
        }
    }
    return (
        <>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
        </>
    )
}