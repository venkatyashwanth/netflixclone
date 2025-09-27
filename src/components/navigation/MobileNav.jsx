import styles from "@/styles/components/Navigation.module.scss"
import LogoutButton from "../logout/LogoutButton";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";

export default function MobileNav({ isAuthenticated }) {
  const t = useTranslations('Navigation');
  return (
    <>
      <header className={styles.mobileHeader}>
        <div className={styles.logo}>
          <img src="/logo.svg" alt="logo" />
        </div>
      </header>

      <nav className={styles.mobileNav}>
        {isAuthenticated ? (
          <>
            <button>🏠</button>
            <button>🔍</button>
            <button>📺</button>
            <button>👤</button>
            <LogoutButton />
          </>
        ) : (
          <>
            <LocaleSwitcherSelect />
            {/* <Link className={styles.loglink} href="/login">{t("signin")}</Link> */}
          </>
        )}
      </nav>
    </>
  );
}
