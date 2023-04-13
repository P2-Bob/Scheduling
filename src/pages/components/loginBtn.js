import { useSession, signIn, signOut } from "next-auth/react"
import styles from "@/styles/LoginBtn.module.css"
import { AiOutlineDown } from "react-icons/ai"
import { useState } from "react"
import Link from "next/link"



export default function Component({ initials }) {
  const { data: session } = useSession()
  const [profileDropDown, setProfileDropDown] = useState(false)

  const handleMouseEnter = () => {
    setProfileDropDown(true);
  }

  const handleMouseLeave = () => {
    setProfileDropDown(false);
  }

  if (session) {
    return (
      <div className={styles.loggedIn} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <p className={styles.name}>
          {session.user.name}
        </p>
        <AiOutlineDown className={styles.icon} />
        <div className={styles.avatar}>
          {initials}
        </div>
        { profileDropDown &&
        <div className={styles.dropDown}>
            <Link href="/profile">
              <p className={styles.dropDownItem}>Profile</p>
            </Link>
          <p className={styles.dropDownItem} onClick={() => signOut()}>Sign out</p>
        </div>
        }
      </div>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}