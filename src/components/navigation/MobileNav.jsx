"use client";
import styles from "@/styles/components/Navigation.module.scss"
import LogoutButton from "../logout/LogoutButton";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";
import { useAuth } from "@/contexts/Authcontext";
import { useScroll } from "@/contexts/ScrollContext";
import { useEffect, useState } from "react";

export default function MobileNav({ }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user } = useAuth();
  const t = useTranslations('Navigation');
  const { isScrolled } = useScroll();
  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user])
  return (
    <>
      <header className={`${styles.mobileHeader} ${isScrolled ? styles.navScrolled : ''}`}>
        <div className={styles.logo}>
          <img src="/logo.svg" alt="logo" />
        </div>
      </header>

      <nav className={styles.mobileNav}>
        {!isAuthenticated && <LocaleSwitcherSelect />}
        {isAuthenticated &&
          (
            <div className={styles.actions}>
              <button>🔍</button>
              <button>🔍</button>
              <button>🔍</button>
              <button>🔍</button>
              <LogoutButton />
            </div>
          )
        }
      </nav>
    </>
  );
}
