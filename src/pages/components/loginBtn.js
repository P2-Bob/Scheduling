import { useSession, signIn, signOut } from "next-auth/react"
import styles from "@/styles/LoginBtn.module.css"
import { AiOutlineDown } from "react-icons/ai"
import { useState } from "react"

//<button onClick={() => signOut()}>Sign out</button>


export default function Component() {
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
          AC
        </div>
        { profileDropDown &&
        <div className={styles.dropDown}>
          <p className={styles.dropDownItem}>Profile</p>
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