"use client";

import { useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/contexts/Authcontext";
import styles from "@/styles/components/Auth.module.scss";

export default function LoginClient({ translations }) {
  const { login } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    const fakeToken = "user-authenticated-token-12345";
    await login(fakeToken);

    router.replace("/dashboard");
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h1>{translations.title}</h1>
        <form className={styles.authForm} onSubmit={handleLogin}>
          {/* Email field */}
          <div className={styles.inputWrp}>
            <label htmlFor="regemail">Email</label>
            <input
              id="regemail"
              type="email"
              placeholder={translations.placeholderEmail}
            />
          </div>

          {/* Password field with toggle */}
          <div className={styles.inputWrp}>
            <label htmlFor="regpassword">Password</label>
            <input
              id="regpassword"
              type={showPassword ? "text" : "password"}
              placeholder={translations.placeholderPassword}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className={styles.pwtglbtn}
              aria-pressed={showPassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <img
                src={showPassword ? "/closeeye.svg" : "/openeye.svg"}
                alt={showPassword ? "Hide password" : "Show password"}
              />
            </button>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className={styles.frmSbmt}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? translations.loggingIn : translations.signin}
          </button>
        </form>

        {/* Helper text */}
        <p className={styles.authText}>
          {translations.prompttext}{" "}
          <Link href="/signup" className={styles.authLink}>
            {translations.signup}
          </Link>
        </p>
      </div>
    </div>
  );
}