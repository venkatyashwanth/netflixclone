"use client";
import { useState, useLayoutEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/contexts/Authcontext";
import { useRouter } from "@/i18n/navigation";
import styles from "@/styles/components/Auth.module.scss";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();
  const t = useTranslations('Login');

  // IMMEDIATE REDIRECT if already authenticated
  useLayoutEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission
    setIsLoggingIn(true);
    const fakeToken = "user-authenticated-token-12345";
    
    await login(fakeToken);
    // The useLayoutEffect above will handle the redirect automatically
  };

  // DON'T RENDER if already authenticated
  if (isAuthenticated) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authBox}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h1>{t('title')}</h1>
        <form className={styles.authForm} onSubmit={handleLogin}>
          <input type="email" placeholder={t("placeholder.email")} />
          <input type="password" placeholder={t("placeholder.password")}/>
          <button 
            type="submit" 
            className={styles.btnPrimary} 
            disabled={isLoggingIn}
          >
            {isLoggingIn ? t('loggingIn') : t('signin')}
          </button>
        </form>
        <p className={styles.authText}>
          {t('prompttext')} {" "}
          <Link href="/signup" className={styles.authLink}>
            {t('signup')}
          </Link>
        </p>
      </div>
    </div>
  );
}