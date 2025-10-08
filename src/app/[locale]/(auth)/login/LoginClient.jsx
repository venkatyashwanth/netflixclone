"use client";

import { useEffect, useRef, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/contexts/Authcontext";
import styles from "@/styles/components/Auth.module.scss";
import { getIdToken } from "firebase/auth";

export default function LoginClient({ translations }) {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  // Refs for form fields
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const [formData, setFormData] = useState({
    userregemail: "",
    userregpassword: ""
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const validate = () => {
    const { userregemail, userregpassword } = formData;
    const errs = {};
    // Email Validation
    if (!userregemail || !/\S+@\S+\.\S+/.test(userregemail)) errs.email = "Invalid Email";
    if (!userregpassword) errs.password = "Password is required";

    return errs;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    const { userregemail, userregpassword } = formData;
    // setIsLoggingIn(true);

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      console.log("got errors");
      setIsLoggingIn(false);

      // Focus on first field with error for better accessibility
      if (errs.email) {
        emailInputRef.current?.focus();
      } else if (errs.password) {
        passwordInputRef.current?.focus();
      }
      return;
    }
    try {
      setErrors({});
      setIsLoggingIn(true);

      // Login user
      const userCredential = await login(userregemail, userregpassword);
      const token = await getIdToken(userCredential.user);
      await fetch('/api/auth-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      router.push(`/home`);
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        setErrors({ globalError: 'Check Your Credentials' });
      } else {
        setErrors('Failed to create account: ' + error.message);
      }
      // setError('Failed to log in: ' + error.message);
    }
    setIsLoggingIn(false);

  };

  // Live region for announcing errors
  const getErrorAnnouncement = () => {
    const errorMessages = Object.values(errors).filter(error => error);
    if (errorMessages.length > 0) {
      return `Form errors: ${errorMessages.join('. ')}`;
    }
    return "";
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h1>{translations.title}</h1>
        {/* Live region for announcing errors to screen readers */}
        <div
          aria-live="assertive"
          aria-atomic="true"
          className={styles.srOnly}
        >
          {getErrorAnnouncement()}
        </div>
        <form className={styles.authForm} onSubmit={handleLogin}>
          {/* Email field */}
          <div className={styles.inputWrp}>
            <label htmlFor="regemail">
              {translations.email}
            </label>
            <input
              ref={emailInputRef}
              id="regemail"
              type="email"
              name="userregemail"
              value={formData.userregemail}
              onChange={handleChange}
              placeholder={translations.placeholderEmail}
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={!!errors.email}
            />
            {
              errors.email && (
                <span
                  id="email-error"
                  className={styles.errorText}
                  role="alert"
                  aria-live="polite"
                >
                  {errors.email}
                </span>
              )
            }
          </div>

          {/* Password field with toggle */}
          <div className={styles.inputWrp}>
            <label htmlFor="regpassword">
              {translations.password}
            </label>
            <input
              type={showPassword ? "text" : "password"}
              ref={passwordInputRef}
              id="regpassword"
              name="userregpassword"
              value={formData.userregpassword}
              onChange={handleChange}
              placeholder={translations.placeholderPassword}
              aria-describedby={errors.password ? "password-error" : undefined}
              aria-invalid={!!errors.password}
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
            {errors.password && (
              <span
                id="password-error"
                className={styles.errorText}
                role="alert"
                aria-live="polite"
              >
                {errors.password}
              </span>
            )}
          </div>
          {errors.globalError && (
            <span className={styles.errorText}>{errors.globalError}</span>
          )}

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
        <div className={styles.authText}>
          <Link href="/forgot-password" className={styles.authLink}>
            {translations.forgotPassword}!
          </Link>
        </div>
      </div>
    </div>
  );
}