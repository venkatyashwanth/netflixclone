import Link from "next/link";
import styles from "@/styles/components/Auth.module.scss";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations('Login');
  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        {/* <h1>Login</h1> */}
        <h1>{t('title')}</h1>
        <form className={styles.authForm}>
          <input type="email" placeholder={t("placeholder.email")} required />
          <input type="password" placeholder={t("placeholder.password")} required />
          <button className={styles.btnPrimary} type="submit">
            {/* Sign In */}
            {t('signin')}
          </button>
        </form>
        <p className={styles.authText}>
          {/* Don’t have an account? {" "} */}
          {t('prompttext')} {" "}
          <Link href="/signup" className={styles.authLink}>
            {/* Sign up */}
            {t('signup')}
          </Link>
        </p>
      </div>
    </div>
  );
}
