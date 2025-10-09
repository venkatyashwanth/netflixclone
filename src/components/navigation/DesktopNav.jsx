"use cleint";
import { useTranslations } from "next-intl";
import styles from "@/styles/components/Navigation.module.scss";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";
import LogoutButton from "../logout/LogoutButton";
import { useAuth } from "@/contexts/Authcontext";
import { useScroll } from "@/contexts/ScrollContext";

export default function DesktopNav() {
  const { user } = useAuth();
  const t = useTranslations('Navigation');

  const { isScrolled } = useScroll();
  return (
    <div className={`${styles.desktopNav} ${isScrolled ? styles.navScrolled : ''}`}>
      <div className={styles.logo}>
        <img src="/logo.svg" alt="logo" />
      </div>
      <nav>
        {
          user && (
            <>
              <a href="#">Home</a>
              {/* <a href="#">TV Shows</a>
            <a href="#">Movies</a>
            <a href="#">My List</a> */}
            </>
          )
        }
        {/* {user ? (
          <>
            <a href="#">Home</a>
          </>
        ) : (
          <>
            <LocaleSwitcherSelect />
          </>
        )} */}
      </nav>
      {!user &&
        <div className={styles.localeSwitcher}>
          <LocaleSwitcherSelect />
        </div>
      }
      {user && (
        <div className={styles.actions}>
          <button>🔔</button>
          <button>👤</button>
          <LogoutButton />
        </div>
      )}
    </div>
  );
}
