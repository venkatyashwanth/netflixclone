"use client";
import { Link } from "@/i18n/navigation";
import styles from "@/styles/components/Auth.module.scss";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/contexts/Authcontext";
import { useRouter } from "@/i18n/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const t = useTranslations('Login');
  const handleLogin = async () => {
    // Simulate API call - replace with your actual login logic
    const fakeToken = "user-authenticated-token-12345";
    
    login(fakeToken); // This sets the cookie and auth state
    
    // Redirect to dashboard
    router.push('/dashboard');
  };
  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        {/* <h1>Login</h1> */}
        <h1>{t('title')}</h1>
        <form className={styles.authForm}>
          <input type="email" placeholder={t("placeholder.email")} required />
          <input type="password" placeholder={t("placeholder.password")} required />
          <button className={styles.btnPrimary} onClick={handleLogin}>
            {t('signin')}
          </button>
        </form>
        <p className={styles.authText}>
          {/* Don’t have an account? {" "} */}
          {t('prompttext')} {" "}
          <Link href="/signup" className={styles.authLink}>
            {t('signup')}
          </Link>
        </p>
      </div>
    </div>
  );
}
