"use client";
import Link from "next/link";
import styles from "@/styles/components/Auth.module.scss";
import { useTranslations } from "next-intl";

export default function SignupPage() {
  const t = useTranslations('Signup');

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        {/* <h1>Sign Up</h1> */}
        <h1>{t('title')}</h1>
        <form className={styles.authForm}>
          <input type="text" placeholder={t("placeholder.fullname")} required />
          <input type="email" placeholder={t("placeholder.email")} required />
          <input type="password" placeholder={t("placeholder.password")} required />
          <button className={styles.btnPrimary} type="submit">
            {t("createaccount")}
          </button>
        </form>
        <p className={styles.authText}>
          {t("prompttext")}{" "}
          <Link href="/login" className={styles.authLink}>
            {t("login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
