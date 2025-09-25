"use cleint";
import { useTranslations } from "next-intl";
import styles from "@/styles/components/Navigation.module.scss";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";
import { Link } from "@/i18n/navigation";
import LogoutButton from "../logout/LogoutButton";

export default function DesktopNav({ isAuthenticated }) {
  const t = useTranslations('Navigation');
  return (
    <div className={styles.desktopNav}>
      <div className={styles.logo}>
        <img src="/logo.svg" alt="logo" width={"100px"} color={"rgb(229, 9, 20)"} fill={"currentcolor"} />
      </div>
      <nav>
        {isAuthenticated ? (
          <>
            <a href="#">Home</a>
            <a href="#">TV Shows</a>
            <a href="#">Movies</a>
            <a href="#">My List</a>
          </>
        ) : (
          <>
            <LocaleSwitcherSelect />
            <Link href="/login">{t("signin")}</Link>
          </>
        )}
      </nav>
      {isAuthenticated && (
        <div className={styles.actions}>
          <button>🔔</button>
          <button>👤</button>
          <LogoutButton/>
        </div>
      )}
    </div>
  );
}
